import { useRef, useCallback } from 'react';

interface PressAndHoldOptions {
  onPressStart?: () => void;
  onPressEnd?: () => void;
  onLongPress?: () => void;
  delay?: number;
}

export const usePressAndHold = (options: PressAndHoldOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);
  
  const delay = options.delay || 800; // Default 800ms for long press

  const startPress = useCallback(() => {
    if (isPressingRef.current) return;
    
    isPressingRef.current = true;
    options.onPressStart?.();
    
    // Haptic feedback on press start
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isPressingRef.current && options.onLongPress) {
        options.onLongPress();
        // Stronger haptic feedback for long press
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    }, delay);
  }, [options, delay]);

  const endPress = useCallback(() => {
    if (!isPressingRef.current) return;
    
    isPressingRef.current = false;
    options.onPressEnd?.();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [options]);

  const pressHandlers = {
    onMouseDown: startPress,
    onMouseUp: endPress,
    onMouseLeave: endPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onTouchCancel: endPress,
  };

  return {
    pressHandlers,
    isPressed: isPressingRef.current,
  };
};