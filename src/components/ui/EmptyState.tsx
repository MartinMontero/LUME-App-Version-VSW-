import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'constellation';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-16 animate-fade-in-up ${className}`}>
      <div className="w-20 h-20 bg-lume-ocean/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-lume-mist/20">
        <Icon className="w-10 h-10 text-lume-mist animate-pulse" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-lume-light opacity-80 max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={`btn-${action.variant || 'constellation'} animate-fade-in-scale`}
          style={{ animationDelay: '0.3s' }}
        >
          {action.label}
        </button>
      )}
      
      {/* Gentle animation suggesting action */}
      <div className="mt-8 flex justify-center">
        <div className="w-2 h-2 bg-lume-glow/40 rounded-full animate-pulse mx-1"></div>
        <div className="w-2 h-2 bg-lume-soft/40 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-lume-warm/40 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};