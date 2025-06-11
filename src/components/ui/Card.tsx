import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  status?: 'live' | 'default';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  status = 'default'
}) => {
  return (
    <div className={`
      bg-white rounded-lg shadow-md p-6 
      ${hover ? 'card-hover' : ''} 
      ${status === 'live' ? 'status-live' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};