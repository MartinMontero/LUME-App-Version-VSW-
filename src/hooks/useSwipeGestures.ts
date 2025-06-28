import { useState, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useSwipeGestures = (options: SwipeGestureOptions) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  
  const threshold = options.threshold || 50;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchEndRef.current = null;
    setIsSwiping(true);
    setSwipeDirection(null);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        setSwipeDirection(deltaY > 0 ? 'down' : 'up');
      }
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;

    // Execute swipe actions based on direction and threshold
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && options.onSwipeRight) {
          options.onSwipeRight();
        } else if (deltaX < 0 && options.onSwipeLeft) {
          options.onSwipeLeft();
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && options.onSwipeDown) {
          options.onSwipeDown();
        } else if (deltaY < 0 && options.onSwipeUp) {
          options.onSwipeUp();
        }
      }
    }

    setIsSwiping(false);
    setSwipeDirection(null);
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [options, threshold]);

  return {
    isSwiping,
    swipeDirection,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};