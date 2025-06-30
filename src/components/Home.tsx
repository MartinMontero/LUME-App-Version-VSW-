import React from 'react';
import { Calendar, Users, Mic, ArrowRight, Sparkles, Globe, Rocket, Zap } from 'lucide-react';
import { scrollToSection, triggerHaptic } from '../utils';

interface HomeProps {
  onAuthClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ onAuthClick }) => {
  const stats = [
    { 
      icon: Calendar, 
      value: '50+', 
      label: 'Events', 
      color: 'from-lume-glow to-lume-soft',
      description: 'Curated sessions across all tracks'
    },
    { 
      icon: Users, 
      value: '1500+', 
      label: 'Attendees', 
      color: 'from-lume-warm to-lume-spark',
      description: 'Entrepreneurs and innovators'
    },
    { 
      icon: Mic, 
      value: '70+', 
      label: 'Speakers', 
      color: 'from-lume-soft to-lume-glow',
      description: 'Industry leaders and experts'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Networking',
      description: 'AI-powered connections based on your interests and goals',
      color: 'from-lume-glow to-lume-soft'
    },
    {
      icon: Globe,
      title: 'Live Updates',
      description: 'Real-time event changes and spontaneous meetups',
      color: 'from-lume-warm to-lume-spark'
    },
    {
      icon: Rocket,
      title: 'Community Driven',
      description: 'Discover unofficial gatherings and connect authentically',
      color: 'from-lume-soft to-lume-glow'
    }
  ];

  const handleExploreEvents = () => {
    scrollToSection('schedule');
    triggerHaptic('medium');
  };

  const handleJoinConstellation = () => {
    onAuthClick();
    triggerHaptic('medium');
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-20 relative overflow-hidden bg-pattern">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-lume-glow/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-lume-warm/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-lume-soft/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional ambient light effects */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lume-glow/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-lume-warm/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-lume-soft/60 rounded-full animate-pulse" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Enhanced Hero Content */}
        <div className="mb-20 animate-slide-up">
          <div className="inline-flex items-center px-6 py-3 bg-lume-ocean/50 backdrop-blur-sm rounded-full text-lume-glow text-sm font-medium mb-8 border border-lume-glow/20 hover:border-lume-glow/40 transition-all duration-300 group">
            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Vancouver Startup Week 2025</span>
            <div className="ml-2 w-2 h-2 bg-lume-glow rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white mb-8 leading-tight">
            <span className="block">Where diverse minds</span>
            <span className="block gradient-text bg-clip-text text-transparent bg-gradient-to-r from-lume-glow via-lume-soft to-lume-warm animate-gradient">
              converge into brilliance
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-lume-light max-w-4xl mx-auto mb-12 leading-relaxed opacity-90">
            Your intelligent companion for Vancouver Startup Week. Discover breakthrough opportunities, 
            connect with fellow entrepreneurs, and build the future together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto">
            <button 
              onClick={handleExploreEvents} 
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto group"
              aria-label="Explore all events and sessions"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleJoinConstellation} 
              className="btn-constellation text-lg px-8 py-4 w-full sm:w-auto group"
              aria-label="Join the LUME constellation community"
            >
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Join Constellation</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="card-elevated p-8 text-center interactive group hover:scale-105"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-display font-bold text-white mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-lume-light font-semibold mb-2 opacity-90">
                  {stat.label}
                </div>
                <div className="text-sm text-lume-mist opacity-70">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="card-floating p-8 text-center group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-4 group-hover:text-lume-glow transition-colors">
                  {feature.title}
                </h3>
                <p className="text-lume-light leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="card-elevated p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-white mb-4">
              Ready to illuminate your startup journey?
            </h2>
            <p className="text-lume-light mb-6 opacity-80">
              Join thousands of entrepreneurs, investors, and innovators shaping the future of technology.
            </p>
            <button 
              onClick={handleJoinConstellation}
              className="btn-constellation text-lg px-8 py-4 group"
              aria-label="Start your journey with LUME"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Your Journey</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};