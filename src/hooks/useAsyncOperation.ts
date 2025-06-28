import { useState, useCallback, useRef, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface AsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retries?: number;
  retryDelay?: number;
}

export function useAsyncOperation<T>(
  operation: () => Promise<{ data: T | null; error: string | null }>,
  options: AsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(async (...args: any[]) => {
    // Cancel previous operation
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    let attempt = 0;
    const maxAttempts = (options.retries || 0) + 1;

    while (attempt < maxAttempts) {
      try {
        if (!mountedRef.current) return;

        const result = await operation();

        if (!mountedRef.current) return;

        if (result.error) {
          throw new Error(result.error);
        }

        setState({
          data: result.data,
          loading: false,
          error: null
        });

        options.onSuccess?.(result.data);
        return result.data;

      } catch (error) {
        attempt++;
        
        if (!mountedRef.current) return;

        const errorMessage = error instanceof Error ? error.message : 'An error occurred';

        if (attempt >= maxAttempts) {
          setState({
            data: null,
            loading: false,
            error: errorMessage
          });

          options.onError?.(errorMessage);
          throw error;
        }

        // Wait before retry
        if (options.retryDelay && attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, options.retryDelay));
        }
      }
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.error && !state.data
  };
}

// Specialized hook for data fetching
export function useAsyncData<T>(
  fetcher: () => Promise<{ data: T | null; error: string | null }>,
  dependencies: any[] = [],
  options: AsyncOperationOptions & { immediate?: boolean } = {}
) {
  const { immediate = true, ...asyncOptions } = options;
  const asyncOp = useAsyncOperation(fetcher, asyncOptions);

  useEffect(() => {
    if (immediate) {
      asyncOp.execute();
    }
  }, dependencies);

  return asyncOp;
}

// Hook for handling form submissions
export function useAsyncSubmit<T>(
  submitFn: (data: any) => Promise<{ data: T | null; error: string | null }>,
  options: AsyncOperationOptions = {}
) {
  const asyncOp = useAsyncOperation(submitFn, options);

  const submit = useCallback(async (formData: any) => {
    try {
      return await asyncOp.execute(formData);
    } catch (error) {
      // Error is already handled by useAsyncOperation
      return null;
    }
  }, [asyncOp]);

  return {
    ...asyncOp,
    submit
  };
}