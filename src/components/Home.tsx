import React from 'react';
import { Calendar, Users, Mic, ArrowRight, Sparkles, Globe, Rocket } from 'lucide-react';

interface HomeProps {
  onAuthClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ onAuthClick }) => {
  const stats = [
    { icon: Calendar, value: '50+', label: 'Events', color: 'from-lume-glow to-lume-soft' },
    { icon: Users, value: '1500+', label: 'Attendees', color: 'from-lume-warm to-lume-spark' },
    { icon: Mic, value: '70+', label: 'Speakers', color: 'from-lume-soft to-lume-glow' }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Networking',
      description: 'AI-powered connections based on your interests and goals'
    },
    {
      icon: Globe,
      title: 'Live Updates',
      description: 'Real-time event changes and spontaneous meetups'
    },
    {
      icon: Rocket,
      title: 'Community Driven',
      description: 'Discover unofficial gatherings and connect authentically'
    }
  ];

  const scrollToSchedule = () => {
    const element = document.getElementById('schedule');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const scrollToCommunity = () => {
    const element = document.getElementById('community');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleAuthClick = () => {
    onAuthClick();
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 py-20 relative overflow-hidden bg-pattern safe-area-top">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lume-glow/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-lume-warm/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-lume-soft/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-ocean/50 backdrop-blur-sm rounded-full text-lume-glow text-sm font-medium mb-6 border border-lume-glow/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Vancouver Startup Week 2025
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Where boundaries
            <span className="block gradient-text">dissolve into brilliance</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-lume-light max-w-4xl mx-auto mb-12 leading-relaxed opacity-90">
            Your intelligent companion for Vancouver Startup Week. Discover breakthrough opportunities, 
            connect with fellow entrepreneurs, and build the future together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={scrollToSchedule} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleAuthClick} className="btn-constellation text-lg px-8 py-4 w-full sm:w-auto">
              <Sparkles className="w-5 h-5" />
              Add to Constellation
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-elevated p-6 md:p-8 text-center interactive">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lume-light font-medium opacity-80">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-floating p-6 md:p-8 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lume-ocean/50 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-lume-glow" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-lume-light leading-relaxed opacity-80">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};