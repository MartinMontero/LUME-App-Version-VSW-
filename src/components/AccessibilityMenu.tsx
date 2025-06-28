import React, { useState } from 'react';
import { Settings, Eye, Type, Zap, X } from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, toggleHighContrast, toggleReduceMotion, toggleLargeText } = useAccessibility();

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="accessibility-trigger"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Accessibility Menu */}
      {isOpen && (
        <div className="accessibility-menu-overlay" onClick={() => setIsOpen(false)}>
          <div className="accessibility-menu" onClick={(e) => e.stopPropagation()}>
            <div className="accessibility-header">
              <h3 className="accessibility-title">
                <Eye className="w-5 h-5" />
                Accessibility Settings
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="accessibility-close"
                aria-label="Close accessibility settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="accessibility-content">
              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  <h4 className="accessibility-option-title">High Contrast</h4>
                  <p className="accessibility-option-description">
                    Increase contrast for better visibility while maintaining LUME's aesthetic
                  </p>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`accessibility-toggle ${preferences.highContrast ? 'active' : ''}`}
                  aria-pressed={preferences.highContrast}
                >
                  <div className="accessibility-toggle-slider"></div>
                </button>
              </div>

              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  <h4 className="accessibility-option-title">Reduce Motion</h4>
                  <p className="accessibility-option-description">
                    Minimize animations and transitions for a calmer experience
                  </p>
                </div>
                <button
                  onClick={toggleReduceMotion}
                  className={`accessibility-toggle ${preferences.reduceMotion ? 'active' : ''}`}
                  aria-pressed={preferences.reduceMotion}
                >
                  <div className="accessibility-toggle-slider"></div>
                </button>
              </div>

              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  <h4 className="accessibility-option-title">Large Text</h4>
                  <p className="accessibility-option-description">
                    Increase text size for improved readability
                  </p>
                </div>
                <button
                  onClick={toggleLargeText}
                  className={`accessibility-toggle ${preferences.largeText ? 'active' : ''}`}
                  aria-pressed={preferences.largeText}
                >
                  <div className="accessibility-toggle-slider"></div>
                </button>
              </div>

              <div className="accessibility-info">
                <Zap className="w-4 h-4 text-lume-glow" />
                <p className="text-sm text-lume-light opacity-80">
                  LUME adapts to your system preferences automatically. These settings provide additional customization.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};