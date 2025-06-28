import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface BrightnessCardProps {
  title: string;
  description: string;
  brightness: number; // 0-100
  collaborators: Collaborator[];
  category?: string;
  className?: string;
}

export const BrightnessCard: React.FC<BrightnessCardProps> = ({
  title,
  description,
  brightness,
  collaborators,
  category,
  className = ''
}) => {
  const [animatedBrightness, setAnimatedBrightness] = useState(0);

  useEffect(() => {
    // Animate brightness fill on load
    const timer = setTimeout(() => {
      setAnimatedBrightness(brightness);
    }, 300);

    return () => clearTimeout(timer);
  }, [brightness]);

  const getBrightnessGlow = (level: number) => {
    const intensity = level / 100;
    return {
      boxShadow: `0 0 ${20 + intensity * 30}px rgba(255, 230, 109, ${0.2 + intensity * 0.4})`
    };
  };

  const getBrightnessLabel = (level: number) => {
    if (level >= 80) return 'Brilliant';
    if (level >= 60) return 'Bright';
    if (level >= 40) return 'Glowing';
    if (level >= 20) return 'Emerging';
    return 'Sparking';
  };

  return (
    <div 
      className={`brightness-card ${className}`}
      style={getBrightnessGlow(brightness)}
    >
      <div className="brightness-card-content">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {category && (
              <span className="inline-block px-2 py-1 bg-lume-warm/20 text-lume-warm text-xs font-medium rounded-full border border-lume-warm/30 mb-2">
                {category}
              </span>
            )}
            <h3 className="font-display font-semibold text-white text-lg leading-tight mb-2">
              {title}
            </h3>
            <p className="text-lume-light text-sm opacity-80 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Brightness Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Brightness
            </span>
            <span className="text-sm text-lume-warm font-semibold">
              {getBrightnessLabel(brightness)}
            </span>
          </div>
          
          <div className="brightness-meter">
            <div className="brightness-meter-track">
              <div 
                className="brightness-meter-fill"
                style={{ 
                  width: `${animatedBrightness}%`,
                  background: `linear-gradient(90deg, 
                    rgba(255, 230, 109, 0.6) 0%, 
                    var(--lume-warm) ${Math.min(100, animatedBrightness + 20)}%)`
                }}
              >
                <div className="brightness-shimmer"></div>
              </div>
            </div>
            
            {/* Brightness percentage */}
            <div className="text-right mt-1">
              <span className="text-xs text-lume-warm font-bold">
                {brightness}%
              </span>
            </div>
          </div>
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-lume-mist" />
                Collaborators
              </span>
              <span className="text-xs text-lume-mist">
                {collaborators.length} active
              </span>
            </div>
            
            <div className="collaborators-container">
              {collaborators.slice(0, 5).map((collaborator, index) => (
                <div
                  key={collaborator.id}
                  className="collaborator-circle"
                  style={{
                    background: `linear-gradient(135deg, ${collaborator.color}, ${collaborator.color}dd)`,
                    marginLeft: index > 0 ? '-8px' : '0',
                    zIndex: collaborators.length - index
                  }}
                  title={collaborator.name}
                >
                  <span className="collaborator-initials">
                    {collaborator.initials}
                  </span>
                </div>
              ))}
              
              {collaborators.length > 5 && (
                <div 
                  className="collaborator-circle collaborator-overflow"
                  style={{ marginLeft: '-8px', zIndex: 0 }}
                >
                  <span className="collaborator-initials">
                    +{collaborators.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Area */}
        <div className="flex items-center justify-between pt-4 border-t border-lume-ocean/30">
          <button className="btn-ghost text-lume-glow hover:bg-lume-glow/10 text-sm">
            View Details
          </button>
          <button className="btn-secondary text-sm px-4 py-2">
            Collaborate
          </button>
        </div>
      </div>
    </div>
  );
};