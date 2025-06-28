import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Brain, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { lessonsData } from '../data/sampleData';
import { ProjectShowcase } from './ProjectShowcase';

export const Approach: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);

  const toggleLesson = (index: number) => {
    setExpandedLesson(expandedLesson === index ? null : index);
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        import('chart.js/auto').then((Chart) => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }

          chartInstanceRef.current = new Chart.default(ctx, {
            type: 'line',
            data: {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
              datasets: [
                {
                  label: 'Networking',
                  data: [65, 72, 78, 85, 88, 92],
                  borderColor: 'var(--lume-glow)',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  tension: 0.4,
                  fill: true
                },
                {
                  label: 'Event Discovery',
                  data: [70, 75, 82, 87, 90, 95],
                  borderColor: 'var(--lume-soft)',
                  backgroundColor: 'rgba(149, 225, 211, 0.2)',
                  tension: 0.4,
                  fill: true
                },
                {
                  label: 'Community Engagement',
                  data: [60, 68, 75, 80, 85, 89],
                  borderColor: 'var(--lume-warm)',
                  backgroundColor: 'rgba(255, 230, 109, 0.2)',
                  tension: 0.4,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    color: 'var(--lume-light)',
                    font: {
                      size: 12,
                      family: 'Inter'
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    },
                    color: 'var(--lume-light)'
                  },
                  grid: {
                    color: 'rgba(118, 146, 183, 0.2)'
                  }
                },
                x: {
                  ticks: {
                    color: 'var(--lume-light)'
                  },
                  grid: {
                    color: 'rgba(118, 146, 183, 0.2)'
                  }
                }
              },
              elements: {
                point: {
                  radius: 6,
                  hoverRadius: 8
                }
              }
            }
          });
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  const insights = [
    {
      icon: Brain,
      title: 'Behavioral Psychology',
      description: 'Every feature is designed using proven psychological principles to maximize engagement and meaningful connections.',
      color: 'from-lume-spark to-lume-warm'
    },
    {
      icon: TrendingUp,
      title: 'Network Theory',
      description: 'Leveraging the science of networks to create exponential value through strategic connection facilitation.',
      color: 'from-lume-glow to-lume-soft'
    },
    {
      icon: Users,
      title: 'Community Dynamics',
      description: 'Understanding how communities form and thrive to build features that strengthen social bonds.',
      color: 'from-lume-soft to-lume-glow'
    },
    {
      icon: Lightbulb,
      title: 'Serendipity Engineering',
      description: 'Systematically creating conditions for unexpected discoveries and breakthrough moments.',
      color: 'from-lume-warm to-lume-spark'
    }
  ];

  return (
    <section id="insights" className="py-24 px-6 gradient-ocean">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-warm/20 backdrop-blur-sm rounded-full text-lume-warm text-sm font-medium mb-6 border border-lume-warm/20">
            <Brain className="w-4 h-4 mr-2" />
            Design Philosophy
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Science-Backed
            <span className="block gradient-text">Approach</span>
          </h2>
          <p className="text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
            This platform is built on key insights from behavioral psychology and network theory. 
            Every feature is intentionally crafted to maximize meaningful connections and opportunities.
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 bg-gradient-to-br ${insight.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-3">
                  {insight.title}
                </h3>
                <p className="text-lume-light leading-relaxed text-sm opacity-80">
                  {insight.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Analytics & Lessons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-display font-semibold text-white mb-6">
              Engagement Analytics
            </h3>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-2xl font-display font-semibold text-white mb-8">
              Key Principles Applied
            </h3>
            
            <div className="space-y-4">
              {lessonsData.map((lesson, index) => (
                <div key={index} className="border border-lume-ocean/50 rounded-xl overflow-hidden backdrop-blur-sm">
                  <button
                    onClick={() => toggleLesson(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-lume-ocean/30 transition-colors"
                  >
                    <span className="font-display font-semibold text-white text-lg">
                      {lesson.title}
                    </span>
                    {expandedLesson === index ? (
                      <ChevronUp className="w-5 h-5 text-lume-mist" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-lume-mist" />
                    )}
                  </button>
                  
                  {expandedLesson === index && (
                    <div className="px-6 pb-6 animate-slide-up">
                      <p className="text-lume-light leading-relaxed opacity-90">
                        {lesson.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Showcase */}
        <ProjectShowcase />
      </div>
    </section>
  );
};