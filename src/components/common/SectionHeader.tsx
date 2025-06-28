import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  badge?: {
    icon: LucideIcon;
    text: string;
    color: string;
  };
  title: string;
  subtitle?: string;
  description: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  description,
  className = '',
}) => {
  return (
    <div className={`text-center mb-16 animate-fade-in-up ${className}`}>
      {badge && (
        <div className={`inline-flex items-center px-4 py-2 bg-${badge.color}/20 backdrop-blur-sm rounded-full text-${badge.color} text-sm font-medium mb-6 border border-${badge.color}/20`}>
          <badge.icon className="w-4 h-4 mr-2" />
          {badge.text}
        </div>
      )}
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
        {title}
        {subtitle && <span className="block gradient-text">{subtitle}</span>}
      </h2>
      
      <p className="text-lg md:text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
        {description}
      </p>
    </div>
  );
};