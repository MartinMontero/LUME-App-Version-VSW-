import { HAPTIC_PATTERNS } from '../constants';

// Date and time utilities
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatScheduledTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
};

export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) return `${diffHours}h ${diffMins}m left`;
  if (diffMins > 0) return `${diffMins}m left`;
  return 'Expired';
};

// Haptic feedback utilities
export const triggerHaptic = (pattern: keyof typeof HAPTIC_PATTERNS): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  }
};

// Scroll utilities
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  triggerHaptic('light');
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Animation utilities
export const createStaggerDelay = (index: number, baseDelay = 0.1): string => {
  return `${baseDelay * index}s`;
};

// Brightness utilities for project cards
export const getBrightnessLabel = (level: number): string => {
  if (level >= 80) return 'Brilliant';
  if (level >= 60) return 'Bright';
  if (level >= 40) return 'Glowing';
  if (level >= 20) return 'Emerging';
  return 'Sparking';
};

export const getBrightnessGlow = (level: number): React.CSSProperties => {
  const intensity = level / 100;
  return {
    boxShadow: `0 0 ${20 + intensity * 30}px rgba(255, 230, 109, ${0.2 + intensity * 0.4})`,
  };
};

// Time-based greeting
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 9) {
    return 'Morning Light - Ideas emerging';
  } else if (hour >= 9 && hour < 17) {
    return 'Bright Hours - Building mode';
  } else if (hour >= 17 && hour < 20) {
    return 'Golden Time - Natural connections';
  } else {
    return 'Evening Glow - Deep conversations';
  }
};

// Class name utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};