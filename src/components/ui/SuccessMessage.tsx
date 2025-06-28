import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

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
    
    // Haptic feedback for success
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }

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
        <div className="success-icon">
          <CheckCircle className="w-5 h-5" />
          <div className="success-sparkles">
            <Sparkles className="w-3 h-3 sparkle-1" />
            <Sparkles className="w-2 h-2 sparkle-2" />
            <Sparkles className="w-3 h-3 sparkle-3" />
          </div>
        </div>
        
        <p className="success-message">
          {message}
        </p>
      </div>
      
      {/* Light burst effect */}
      <div className="success-burst-effect"></div>
    </div>
  );
};