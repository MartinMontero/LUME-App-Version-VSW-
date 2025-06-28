import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Zap } from 'lucide-react';
import { triggerHaptic } from '../../utils';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
  autoClose = true,
  duration = 3000,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger light burst animation
    setIsAnimating(true);
    
    // Enhanced haptic feedback for success
    triggerHaptic('success');

    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`success-container ${isAnimating ? 'success-burst' : ''} ${className}`}>
      <div className="success-content">
        {/* Enhanced Success Icon */}
        <div className="success-icon relative">
          <CheckCircle className="w-6 h-6 relative z-10" />
          
          {/* Animated sparkles */}
          <div className="success-sparkles">
            <Sparkles className="w-3 h-3 sparkle-1 absolute -top-1 -right-1 text-lume-glow" />
            <Sparkles className="w-2 h-2 sparkle-2 absolute -bottom-1 -left-1 text-lume-warm" />
            <Sparkles className="w-3 h-3 sparkle-3 absolute top-1 -left-2 text-lume-soft" />
          </div>
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-lume-glow/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-lume-glow/20 rounded-full animate-pulse scale-150" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        {/* Enhanced Message */}
        <div className="flex-1">
          <p className="success-message text-lg">
            {message}
          </p>
          
          {/* Celebration indicator */}
          <div className="flex items-center gap-2 mt-2 text-sm text-lume-glow opacity-80">
            <Zap className="w-4 h-4" />
            <span>Light bridge formed successfully!</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced light burst effect */}
      <div className="success-burst-effect"></div>
      
      {/* Additional celebration effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
        <div className="absolute top-2 left-4 w-1 h-1 bg-lume-glow rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-lume-warm rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-lume-soft rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-2 right-4 w-1 h-1 bg-lume-spark rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
      </div>
    </div>
  );
};