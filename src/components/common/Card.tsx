import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'floating' | 'luminous';
  interactive?: boolean;
  status?: 'live' | 'default';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'elevated',
  interactive = false,
  status = 'default',
  onClick,
}) => {
  const baseClasses = 'rounded-xl backdrop-blur-sm transition-all duration-300';
  
  const variantClasses = {
    elevated: 'card-elevated',
    floating: 'card-floating',
    luminous: 'luminous-node',
  };

  const statusClasses = {
    live: 'status-live',
    default: '',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        statusClasses[status],
        interactive && 'interactive cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};