import React from 'react';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

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
    <div className={`error-container animate-fade-in-up ${className}`}>
      <div className="flex items-start gap-6">
        {/* Enhanced Error Icon */}
        <div className="error-icon relative">
          <AlertCircle className="w-6 h-6 relative z-10" />
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-lume-spark/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-lume-spark/20 rounded-full animate-pulse scale-150" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="flex-1">
          {/* Enhanced Typography */}
          <h4 className="error-title text-lg">
            {title}
          </h4>
          <p className="error-message">
            {message}
          </p>
          
          {/* Enhanced Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="error-retry-button group"
              aria-label="Retry the failed operation"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Let's try that again</span>
            </button>
          )}
          
          {/* Helpful suggestion */}
          <div className="mt-4 p-3 bg-lume-ocean/20 rounded-lg border border-lume-mist/10">
            <div className="flex items-center gap-2 text-sm text-lume-light opacity-80">
              <Zap className="w-4 h-4 text-lume-glow" />
              <span>If the issue persists, try refreshing the page or check your connection.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-lume-spark/5 to-transparent rounded-xl pointer-events-none"></div>
    </div>
  );
};