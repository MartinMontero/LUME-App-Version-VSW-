import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { signOut } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
    { id: 'home', label: 'Home' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'networking', label: 'Network' },
    { id: 'community', label: 'Community' },
    { id: 'insights', label: 'Insights' }
  ];

  // Time-based greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 9) {
      return 'Morning Light - Ideas emerging';
    } else if (hour >= 9 && hour < 17) {
      return 'Bright Hours - Building mode';
    } else if (hour >= 17 && hour < 20) {
      return 'Golden Time - Natural connections';
    } else {
      return 'Evening Glow - Deep conversations';
    }
  };

  useEffect(() => {
    // Set initial greeting
    setGreeting(getTimeBasedGreeting());
    
    // Update greeting every minute
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
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 safe-area-top ${
      scrolled 
        ? 'backdrop-blur-[10px] shadow-lg border-b border-lume-mist/20' 
        : 'bg-transparent'
    }`}
    style={{
      background: scrolled 
        ? 'linear-gradient(180deg, rgba(10, 22, 40, 0.9) 0%, transparent 100%)'
        : 'transparent'
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Greeting */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-aurora rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div 
                className="gradient-text font-light tracking-[0.1em]"
                style={{
                  fontSize: '2rem',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textShadow: '0 0 20px rgba(78, 205, 196, 0.3)'
                }}
              >
                LUME
              </div>
            </div>
            
            {/* Time-based Greeting - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="text-sm text-lume-light/80 font-medium">
                {greeting}
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-lume-glow to-lume-soft text-lume-deep shadow-sm' 
                    : 'text-lume-light hover:text-white hover:bg-lume-ocean/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-lume-ocean/50 rounded-full backdrop-blur-sm border border-lume-mist/20">
                  <User className="w-4 h-4 text-lume-light" />
                  <span className="text-sm font-medium text-lume-light">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-lume-light hover:text-white hover:bg-lume-ocean/50 rounded-full transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={onAuthClick} className="btn-constellation">
                Join Constellation
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-lg hover:bg-lume-ocean/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Greeting */}
        <div className="lg:hidden pb-2 px-2">
          <div className="text-xs text-lume-light/70 font-medium text-center">
            {greeting}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <div className="w-full max-w-sm space-y-4">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`mobile-menu-item ${
                  activeSection === item.id ? 'active' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-6 border-t border-lume-mist/20">
              {user ? (
                <div className="space-y-4">
                  <div className="text-center px-4 py-3 bg-lume-ocean/30 rounded-xl backdrop-blur-sm">
                    <div className="text-sm text-lume-light">
                      Signed in as {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary w-full justify-center min-h-[56px]"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }} 
                  className="btn-constellation w-full justify-center min-h-[56px]"
                >
                  Join Constellation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};