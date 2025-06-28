// Centralized error types for better type safety
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp?: Date;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
}

export interface NetworkError extends AppError {
  status?: number;
  url?: string;
}

export interface AuthError extends AppError {
  type: 'authentication' | 'authorization' | 'session_expired';
}

export interface DatabaseError extends AppError {
  table?: string;
  operation?: 'select' | 'insert' | 'update' | 'delete';
}

// Error factory functions
export const createAppError = (
  code: string, 
  message: string, 
  details?: any
): AppError => ({
  code,
  message,
  details,
  timestamp: new Date()
});

export const createValidationError = (
  field: string,
  value: any,
  message: string
): ValidationError => ({
  code: 'VALIDATION_ERROR',
  message,
  field,
  value,
  timestamp: new Date()
});

export const createNetworkError = (
  message: string,
  status?: number,
  url?: string
): NetworkError => ({
  code: 'NETWORK_ERROR',
  message,
  status,
  url,
  timestamp: new Date()
});

export const createAuthError = (
  type: AuthError['type'],
  message: string
): AuthError => ({
  code: 'AUTH_ERROR',
  message,
  type,
  timestamp: new Date()
});

export const createDatabaseError = (
  message: string,
  table?: string,
  operation?: DatabaseError['operation']
): DatabaseError => ({
  code: 'DATABASE_ERROR',
  message,
  table,
  operation,
  timestamp: new Date()
});

// Error type guards
export const isAppError = (error: any): error is AppError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};

export const isValidationError = (error: any): error is ValidationError => {
  return isAppError(error) && error.code === 'VALIDATION_ERROR' && 'field' in error;
};

export const isNetworkError = (error: any): error is NetworkError => {
  return isAppError(error) && error.code === 'NETWORK_ERROR';
};

export const isAuthError = (error: any): error is AuthError => {
  return isAppError(error) && error.code === 'AUTH_ERROR' && 'type' in error;
};

export const isDatabaseError = (error: any): error is DatabaseError => {
  return isAppError(error) && error.code === 'DATABASE_ERROR';
};