import React from 'react';
import { Calendar, Users, Mic, ArrowRight, Sparkles, Globe, Rocket } from 'lucide-react';

export const Home: React.FC = () => {
  const stats = [
    { icon: Calendar, value: '50+', label: 'Events', color: 'from-orange-500 to-red-500' },
    { icon: Users, value: '1500+', label: 'Attendees', color: 'from-blue-500 to-indigo-500' },
    { icon: Mic, value: '70+', label: 'Speakers', color: 'from-green-500 to-emerald-500' }
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

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Vancouver Startup Week 2025
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-800 mb-6 leading-tight">
            Connect & Grow
            <span className="block text-gradient">Together</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Your intelligent companion for Vancouver Startup Week. Discover breakthrough opportunities, 
            connect with fellow entrepreneurs, and build the future together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary text-lg px-8 py-4">
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Join Community
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-elevated p-8 text-center interactive">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-display font-bold text-neutral-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-floating p-8 text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
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