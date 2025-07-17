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
    <div className={`text-center py-20 animate-fade-in-up ${className}`}>
      {/* Enhanced Icon Container */}
      <div className="relative mx-auto mb-8">
        <div className="w-24 h-24 bg-lume-ocean/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-lume-mist/20 relative overflow-hidden group">
          <Icon className="w-12 h-12 text-lume-mist animate-pulse relative z-10" />
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-lume-glow/10 to-lume-soft/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Rotating border effect */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-lume-glow/30 via-transparent to-lume-soft/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin" style={{ animationDuration: '3s' }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-lume-glow/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-lume-warm/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-lume-soft/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Enhanced Typography */}
      <h3 className="text-2xl font-display font-semibold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {title}
      </h3>
      
      <p className="text-lume-light opacity-80 max-w-md mx-auto leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {description}
      </p>
      
      {/* Enhanced Action Button */}
      {action && (
        <div className="animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={action.onClick}
            className={`btn-${action.variant || 'constellation'} group`}
            aria-label={action.label}
          >
            <span>{action.label}</span>
          </button>
        </div>
      )}
      
      {/* Gentle animation suggesting action */}
      <div className="mt-12 flex justify-center space-x-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="w-2 h-2 bg-lume-glow/40 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-lume-soft/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-lume-warm/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lume-glow rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-lume-warm rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};