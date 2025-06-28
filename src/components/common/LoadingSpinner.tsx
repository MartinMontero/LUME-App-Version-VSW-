import React from 'react';
import { LoadingLight } from '../LoadingLight';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="w-16 h-16 gradient-aurora rounded-2xl flex items-center justify-center mb-6">
        <LoadingLight size={size} />
      </div>
      <p className="text-lume-light animate-fade-in-up">{message}</p>
    </div>
  );
};