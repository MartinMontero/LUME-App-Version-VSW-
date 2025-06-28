import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    keyboardNavigation: false
  });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({
      ...prev,
      reduceMotion: mediaQuery.matches
    }));

    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        reduceMotion: e.matches
      }));
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPreferences(prev => ({
      ...prev,
      highContrast: highContrastQuery.matches
    }));

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        highContrast: e.matches
      }));
    };

    highContrastQuery.addEventListener('change', handleContrastChange);

    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setPreferences(prev => ({
          ...prev,
          keyboardNavigation: true
        }));
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      setPreferences(prev => ({
        ...prev,
        keyboardNavigation: false
      }));
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      highContrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const toggleHighContrast = () => {
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
    document.body.classList.toggle('high-contrast');
  };

  const toggleReduceMotion = () => {
    setPreferences(prev => ({
      ...prev,
      reduceMotion: !prev.reduceMotion
    }));
    document.body.classList.toggle('reduce-motion');
  };

  const toggleLargeText = () => {
    setPreferences(prev => ({
      ...prev,
      largeText: !prev.largeText
    }));
    document.body.classList.toggle('large-text');
  };

  return {
    preferences,
    toggleHighContrast,
    toggleReduceMotion,
    toggleLargeText
  };
};