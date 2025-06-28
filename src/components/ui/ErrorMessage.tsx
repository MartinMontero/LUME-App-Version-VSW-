import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Something dimmed unexpectedly",
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`error-container ${className}`}>
      <div className="flex items-start gap-4">
        <div className="error-icon">
          <AlertCircle className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <h4 className="error-title">
            {title}
          </h4>
          <p className="error-message">
            {message}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="error-retry-button"
            >
              <RefreshCw className="w-4 h-4" />
              Let's try that again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};