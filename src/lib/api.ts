// Enhanced API layer with better error handling and type safety
import { supabase } from './supabase';
import type { Database } from '../types/database';

// Enhanced API response type with better error structure
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Enhanced error type for better error handling
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Generic API function wrapper with improved error handling
export async function apiCall<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> {
  try {
    // Check if we're in development mode without Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        data: null, 
        error: 'Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.' 
      };
    }
    
    const { data, error } = await operation();
    
    if (error) {
      // Normalize error message to string for consistent handling
      const errorMessageString = error.message || error || 'Unknown error';
      
      // Handle network errors gracefully
      if (errorMessageString.includes('Failed to fetch') || 
          errorMessageString.includes('NetworkError') ||
          errorMessageString.includes('fetch')) {
        return { 
          data: null, 
          error: 'Network connection failed. Please check your internet connection and try again.' 
        };
      }
      
      // Handle auth session errors
      if (errorMessageString.includes('Auth session missing') || 
          errorMessageString.includes('Authentication required')) {
        return { 
          data: null, 
          error: 'Authentication required. Please sign in to access this feature.' 
        };
      }
      
      // Log the error message properly for non-auth errors
      console.error('API Error:', errorMessageString);
      
      // Handle different types of errors
      if (error.message) {
        return { data: null, error: error.message };
      }
      
      if (typeof error === 'string') {
        return { data: null, error };
      }
      
      return { data: null, error: 'An unexpected error occurred' };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('API Call Failed:', err);
    
    // Enhanced error handling for different error types
    if (err instanceof Error) {
      // Handle network errors gracefully
      if (err.message.includes('Failed to fetch') || 
          err.message.includes('NetworkError')) {
        return { 
          data: null, 
          error: 'Network connection failed. Please check your internet connection and try again.' 
        };
      }
      return { data: null, error: err.message };
    }
    
    if (typeof err === 'string') {
      return { data: null, error: err };
    }
    
    return { 
      data: null, 
      error: 'An unexpected error occurred' 
    };
  }
}

// Safe API call wrapper that never throws
export async function safeApiCall<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T | null = null
): Promise<ApiResponse<T>> {
  try {
    return await apiCall(operation);
  } catch (err) {
    console.error('Safe API Call Failed:', err);
    return {
      data: fallbackData,
      error: 'Service temporarily unavailable'
    };
  }
}

// Batch operations helper with improved error handling
export async function batchApiCalls<T>(
  operations: Array<() => Promise<{ data: T | null; error: any }>>,
  options: { failFast?: boolean; maxConcurrency?: number } = {}
): Promise<ApiResponse<T[]>> {
  const { failFast = false, maxConcurrency = 5 } = options;
  
  try {
    // Process operations in batches to avoid overwhelming the API
    const batches: Array<Array<() => Promise<{ data: T | null; error: any }>>> = [];
    for (let i = 0; i < operations.length; i += maxConcurrency) {
      batches.push(operations.slice(i, i + maxConcurrency));
    }
    
    const allResults: T[] = [];
    const allErrors: string[] = [];
    
    for (const batch of batches) {
      const results = await Promise.allSettled(
        batch.map(op => apiCall(op))
      );
      
      for (const [index, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          if (result.value.data) {
            allResults.push(result.value.data);
          }
          if (result.value.error) {
            allErrors.push(`Operation ${index + 1}: ${result.value.error}`);
            if (failFast) {
              return {
                data: allResults.length > 0 ? allResults : null,
                error: allErrors.join('; ')
              };
            }
          }
        } else {
          allErrors.push(`Operation ${index + 1}: ${result.reason}`);
          if (failFast) {
            return {
              data: allResults.length > 0 ? allResults : null,
              error: allErrors.join('; ')
            };
          }
        }
      }
    }
    
    return {
      data: allResults.length > 0 ? allResults : null,
      error: allErrors.length > 0 ? allErrors.join('; ') : null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Batch operation failed',
    };
  }
}

// Retry mechanism for failed requests with exponential backoff
export async function retryApiCall<T>(
  operation: () => Promise<ApiResponse<T>>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<ApiResponse<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options;
  
  let lastError: string | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await operation();
    
    if (result.error === null) {
      return result;
    }
    
    lastError = result.error;
    
    // Don't retry on authentication errors
    if (result.error.includes('Authentication required') || 
        result.error.includes('Auth session missing')) {
      break;
    }
    
    if (attempt < maxRetries) {
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return { data: null, error: lastError };
}

// Enhanced cache management with TTL and size limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100;
  private defaultTtl = 300000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }

  clear(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      }))
    };
  }
}

// Export singleton cache instance
export const apiCache = new ApiCache();

// Convenience functions for cache
export function getCachedData<T>(key: string): T | null {
  return apiCache.get<T>(key);
}

export function setCachedData<T>(key: string, data: T, ttl?: number): void {
  apiCache.set(key, data, ttl);
}

export function clearCache(pattern?: string): void {
  apiCache.clear(pattern);
}

// Network status utilities
export function isOnline(): boolean {
  return navigator.onLine;
}

export function getConnectionType(): string {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  return connection?.effectiveType || 'unknown';
}

// API health check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}