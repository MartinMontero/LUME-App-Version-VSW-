import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'chart';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text-group">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-subtitle"></div>
              </div>
            </div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line-short"></div>
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-button"></div>
              <div className="skeleton-button skeleton-button-secondary"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar skeleton-avatar-small"></div>
            <div className="skeleton-text-group">
              <div className="skeleton-text skeleton-title-small"></div>
              <div className="skeleton-text skeleton-subtitle-small"></div>
            </div>
            <div className="skeleton-badge"></div>
          </div>
        );

      case 'text':
        return (
          <div className="skeleton-text-block">
            <div className="skeleton-text skeleton-line"></div>
            <div className="skeleton-text skeleton-line"></div>
            <div className="skeleton-text skeleton-line-short"></div>
          </div>
        );

      case 'avatar':
        return <div className="skeleton-avatar"></div>;

      case 'chart':
        return (
          <div className="skeleton-chart">
            <div className="skeleton-chart-header">
              <div className="skeleton-text skeleton-title"></div>
            </div>
            <div className="skeleton-chart-body">
              <div className="skeleton-chart-bars">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="skeleton-chart-bar"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="skeleton-text skeleton-line"></div>;
    }
  };

  return (
    <div className={`skeleton-container ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-item animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};