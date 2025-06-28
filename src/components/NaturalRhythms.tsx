import React, { useState, useEffect } from 'react';

export const NaturalRhythms: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState<string>('');

  const rhythmIndicators = [
    {
      id: 'morning',
      name: 'Morning Light',
      emoji: '🌅',
      timeRange: '6-9 AM',
      startHour: 6,
      endHour: 9,
      description: 'Fresh ideas emerging'
    },
    {
      id: 'bright',
      name: 'Bright Hours',
      emoji: '☀️',
      timeRange: '9 AM-5 PM',
      startHour: 9,
      endHour: 17,
      description: 'Peak productivity time'
    },
    {
      id: 'golden',
      name: 'Golden Time',
      emoji: '🌇',
      timeRange: '5-8 PM',
      startHour: 17,
      endHour: 20,
      description: 'Natural connections'
    },
    {
      id: 'evening',
      name: 'Evening Glow',
      emoji: '🌙',
      timeRange: '8 PM-12 AM',
      startHour: 20,
      endHour: 24,
      description: 'Deep conversations'
    }
  ];

  useEffect(() => {
    const updateCurrentPeriod = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      const activePeriod = rhythmIndicators.find(period => {
        if (period.id === 'evening') {
          // Handle evening period that can span midnight
          return currentHour >= period.startHour || currentHour < 6;
        }
        return currentHour >= period.startHour && currentHour < period.endHour;
      });
      
      setCurrentPeriod(activePeriod?.id || '');
    };

    // Update immediately
    updateCurrentPeriod();
    
    // Update every minute
    const interval = setInterval(updateCurrentPeriod, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="natural-rhythms-sidebar">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-white mb-2">
          Natural Rhythms
        </h3>
        <p className="text-sm text-lume-light opacity-80">
          Flow with the day's natural energy
        </p>
      </div>
      
      <div className="space-y-3">
        {rhythmIndicators.map((rhythm) => (
          <div
            key={rhythm.id}
            className={`rhythm-indicator ${
              currentPeriod === rhythm.id ? 'rhythm-active' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl rhythm-emoji">
                {rhythm.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm">
                    {rhythm.name}
                  </h4>
                  <span className="text-xs text-lume-mist">
                    {rhythm.timeRange}
                  </span>
                </div>
                <p className="text-xs text-lume-light opacity-70">
                  {rhythm.description}
                </p>
              </div>
            </div>
            
            {currentPeriod === rhythm.id && (
              <div className="rhythm-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-lume-ocean/30">
        <div className="text-center">
          <div className="text-xs text-lume-mist mb-1">Current Energy</div>
          <div className="rhythm-energy-bar">
            <div 
              className="rhythm-energy-fill"
              style={{
                width: `${Math.min(100, (new Date().getHours() / 24) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};