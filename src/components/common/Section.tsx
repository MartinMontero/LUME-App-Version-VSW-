import React from 'react';
import { cn } from '../../utils';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'ocean' | 'pattern';
  padding?: 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  background = 'default',
  padding = 'lg',
}) => {
  const backgroundClasses = {
    default: '',
    ocean: 'gradient-ocean',
    pattern: 'bg-pattern',
  };

  const paddingClasses = {
    sm: 'py-12 px-6',
    md: 'py-16 px-6',
    lg: 'py-24 px-6',
  };

  return (
    <section
      id={id}
      className={cn(
        paddingClasses[padding],
        backgroundClasses[background],
        'safe-area-top',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
};