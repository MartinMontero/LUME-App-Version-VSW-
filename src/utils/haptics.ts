// Haptic feedback utilities for mobile devices

export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  },
  
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },
  
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([25, 25, 25, 25, 25]);
    }
  }
};

// Check if device supports haptic feedback
export const supportsHaptics = (): boolean => {
  return 'vibrate' in navigator;
};

// Enhanced haptic feedback for iOS devices
export const iosHapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    // iOS-specific haptic feedback would go here
    // For now, fallback to vibration API
    hapticFeedback[style]();
  },
  
  notification: (type: 'success' | 'warning' | 'error' = 'success') => {
    // iOS-specific notification haptics would go here
    // For now, fallback to vibration patterns
    switch (type) {
      case 'success':
        hapticFeedback.success();
        break;
      case 'error':
        hapticFeedback.error();
        break;
      default:
        hapticFeedback.notification();
    }
  },
  
  selection: () => {
    // iOS-specific selection haptic would go here
    hapticFeedback.light();
  }
};