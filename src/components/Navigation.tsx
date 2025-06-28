import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb, LogOut, User } from 'lucide-react';
import { signOut } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { triggerHaptic, getTimeBasedGreeting } from '../utils';

interface NavigationProps {
  user: SupabaseUser | null;
  onAuthClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [greeting, setGreeting] = useState('');

  const menuItems = [
    { id: 'home', label: 'Home', description: 'Welcome to LUME' },
    { id: 'schedule', label: 'Schedule', description: 'Discover events' },
    { id: 'networking', label: 'Network', description: 'Connect & collaborate' },
    { id: 'community', label: 'Community', description: 'Join gatherings' },
    { id: 'insights', label: 'Insights', description: 'Learn & grow' }
  ];

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
    
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      
      const sections = menuItems.map(item => document.getElementById(item.id));
      const currentScrollPos = scrollPosition + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= currentScrollPos) {
          setActiveSection(menuItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
    triggerHaptic('light');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      triggerHaptic('medium');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    triggerHaptic('light');
  };

  const handleAuthClick = () => {
    onAuthClick();
    triggerHaptic('medium');
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 safe-area-top ${
        scrolled 
          ? 'backdrop-blur-xl shadow-xl border-b border-lume-mist/20' 
          : 'bg-transparent'
      }`}
      style={{
        background: scrolled 
          ? 'linear-gradient(180deg, rgba(10, 22, 40, 0.95) 0%, rgba(10, 22, 40, 0.8) 100%)'
          : 'transparent'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo with Lightbulb */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('home')}
                className="flex items-center space-x-3 group focus-ring rounded-xl p-2 -m-2"
                aria-label="Go to home"
              >
                <div className="w-10 h-10 gradient-aurora rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div 
                  className="gradient-text font-light tracking-[0.1em] group-hover:scale-105 transition-transform duration-300"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    textShadow: '0 0 20px rgba(78, 205, 196, 0.3)'
                  }}
                >
                  LUME
                </div>
              </button>
              
              {/* Enhanced Greeting */}
              <div className="hidden lg:block">
                <div className="text-sm text-lume-light/80 font-medium px-3 py-1 bg-lume-ocean/20 rounded-full border border-lume-mist/10 backdrop-blur-sm">
                  {greeting}
                </div>
              </div>
            </div>

            {/* Enhanced Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus-ring ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-lume-glow to-lume-soft text-lume-deep shadow-lg' 
                      : 'text-lume-light hover:text-white hover:bg-lume-ocean/50'
                  }`}
                  aria-label={`Navigate to ${item.label}: ${item.description}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeSection !== item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-lume-glow/10 to-lume-soft/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              ))}
            </div>

            {/* Enhanced Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-lume-ocean/50 rounded-xl backdrop-blur-sm border border-lume-mist/20 hover:bg-lume-ocean/70 transition-all duration-300">
                    <div className="w-8 h-8 luminous-avatar text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-white">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </div>
                      {user.user_metadata?.company && (
                        <div className="text-xs text-lume-mist">
                          {user.user_metadata.company}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-3 text-lume-light hover:text-white hover:bg-lume-ocean/50 rounded-xl transition-all duration-300 focus-ring"
                    title="Sign out"
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAuthClick} 
                  className="btn-constellation"
                  aria-label="Join the LUME constellation"
                >
                  <Lightbulb className="w-4 h-4" />
                  Join Constellation
                </button>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-3 rounded-xl hover:bg-lume-ocean/50 transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center focus-ring"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Mobile Greeting */}
          <div className="lg:hidden pb-3 px-2">
            <div className="text-xs text-lume-light/70 font-medium text-center px-3 py-1 bg-lume-ocean/20 rounded-full border border-lume-mist/10 backdrop-blur-sm inline-block">
              {greeting}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <div className="w-full max-w-sm space-y-6">
            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`mobile-menu-item group ${
                    activeSection === item.id ? 'active' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-label={`Navigate to ${item.label}: ${item.description}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-sm text-lume-mist group-hover:text-lume-light transition-colors">
                        {item.description}
                      </div>
                    </div>
                    {activeSection === item.id && (
                      <div className="w-2 h-2 bg-lume-glow rounded-full animate-pulse" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Auth Section */}
            <div className="pt-6 border-t border-lume-mist/20 space-y-4">
              {user ? (
                <>
                  <div className="text-center px-6 py-4 bg-lume-ocean/30 rounded-xl backdrop-blur-sm border border-lume-mist/20">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 luminous-avatar text-sm">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </div>
                        {user.user_metadata?.company && (
                          <div className="text-sm text-lume-mist">
                            {user.user_metadata.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary w-full justify-center min-h-[56px] group"
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleAuthClick();
                    setIsMenuOpen(false);
                  }} 
                  className="btn-constellation w-full justify-center min-h-[56px] group"
                  aria-label="Join the LUME constellation"
                >
                  <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Join Constellation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};