import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };

  const Icon = icons[type];

  useEffect(() => {
    // Trigger appropriate haptic feedback
    switch (type) {
      case 'success':
        triggerHaptic('success');
        break;
      case 'error':
        triggerHaptic('error');
        break;
      case 'warning':
        triggerHaptic('medium');
        break;
      default:
        triggerHaptic('light');
    }

    if (autoClose) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimer);
      };
    }
  }, [autoClose, duration, onClose, type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
    triggerHaptic('light');
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-enter' : 'toast-exit'} group`}>
      <div className="toast-content">
        {/* Enhanced Icon */}
        <div className="toast-icon relative">
          <Icon className="w-5 h-5 relative z-10" />
          
          {/* Success sparkles */}
          {type === 'success' && (
            <div className="absolute inset-0">
              <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-lume-glow animate-pulse" />
              <Sparkles className="w-1.5 h-1.5 absolute -bottom-1 -left-1 text-lume-warm animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          )}
          
          {/* Pulsing glow for errors */}
          {type === 'error' && (
            <div className="absolute inset-0 bg-current/20 rounded-full animate-pulse"></div>
          )}
        </div>
        
        <div className="toast-text">
          {title && (
            <h4 className="toast-title">
              {title}
            </h4>
          )}
          <p className="toast-message">
            {message}
          </p>
        </div>
        
        {/* Enhanced Close Button */}
        <button
          onClick={handleClose}
          className="toast-close group-hover:scale-110 transition-transform"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Enhanced Progress Bar */}
      {autoClose && (
        <div className="toast-progress">
          <div 
            className="toast-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-current/5 to-transparent rounded-xl pointer-events-none opacity-50"></div>
    </div>
  );
};