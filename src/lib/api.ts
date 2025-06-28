import { supabase } from './supabase';
import type { Database } from '../types/database';

// Generic API response type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Generic API function wrapper
export async function apiCall<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('API Error:', error);
      return { data: null, error: error.message || 'An unexpected error occurred' };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('API Call Failed:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    };
  }
}

// Batch operations helper
export async function batchApiCalls<T>(
  operations: Array<() => Promise<{ data: T | null; error: any }>>
): Promise<ApiResponse<T[]>> {
  try {
    const results = await Promise.allSettled(
      operations.map(op => apiCall(op))
    );
    
    const data: T[] = [];
    const errors: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.data) {
          data.push(result.value.data);
        }
        if (result.value.error) {
          errors.push(`Operation ${index + 1}: ${result.value.error}`);
        }
      } else {
        errors.push(`Operation ${index + 1}: ${result.reason}`);
      }
    });
    
    return {
      data: data.length > 0 ? data : null,
      error: errors.length > 0 ? errors.join('; ') : null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Batch operation failed',
    };
  }
}

// Retry mechanism for failed requests
export async function retryApiCall<T>(
  operation: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> {
  let lastError: string | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await operation();
    
    if (result.error === null) {
      return result;
    }
    
    lastError = result.error;
    
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  return { data: null, error: lastError };
}

// Cache management
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedData<T>(key: string, data: T, ttl = 300000): void { // 5 minutes default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}