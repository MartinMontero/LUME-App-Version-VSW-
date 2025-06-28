import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils';
import { triggerHaptic } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'constellation' | 'bridge' | 'light-pulse' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  haptic?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  haptic = true,
  className,
  onClick,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    constellation: 'btn-constellation',
    bridge: 'btn-bridge',
    'light-pulse': 'btn-light-pulse',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg gap-2',
    md: 'px-4 py-2 text-base rounded-xl gap-2',
    lg: 'px-6 py-3 text-lg rounded-xl gap-3',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (haptic) {
      triggerHaptic('medium');
    }
    onClick?.(e);
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};