import React from 'react';

interface LoadingLightProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingLight: React.FC<LoadingLightProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`loading-light ${sizeClasses[size]} ${className}`} />
  );
};