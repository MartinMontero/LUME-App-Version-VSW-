import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Schedule } from './components/Schedule';
import { Networking } from './components/Networking';
import { Community } from './components/Community';
import { Approach } from './components/Approach';
import { AuthModal } from './components/Auth/AuthModal';
import { FloatingParticles } from './components/FloatingParticles';
import { LoadingLight } from './components/LoadingLight';
import { useAuth } from './hooks/useAuth';
import { useModal } from './hooks/useModal';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuth();
  const { isOpen: isAuthModalOpen, openModal: openAuthModal, closeModal: closeAuthModal } = useModal();

  useEffect(() => {
    // Simulate app loading with a more sophisticated animation
    setTimeout(() => setIsLoaded(true), 800);
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lume-deep">
        <div className="text-center">
          <div className="w-16 h-16 gradient-aurora rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LoadingLight size="md" />
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-2 animate-fade-in-up stagger-1">
            LUME
          </h3>
          <p className="text-lume-light opacity-80 animate-fade-in-up stagger-2">
            Where boundaries dissolve into brilliance...
          </p>
          <div className="mt-6 w-48 h-1 bg-lume-ocean rounded-full mx-auto overflow-hidden animate-fade-in-up stagger-3">
            <div className="h-full gradient-aurora rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <FloatingParticles />
      <Navigation user={user} onAuthClick={openAuthModal} />
      <main>
        <div className="animate-fade-in-up stagger-1">
          <Home onAuthClick={openAuthModal} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <Schedule />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <Networking />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <Community />
        </div>
        <div className="animate-fade-in-up stagger-5">
          <Approach />
        </div>
      </main>
      
      <footer className="bg-lume-deep border-t border-lume-ocean/50 text-white py-16 px-6 animate-fade-in-up stagger-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-aurora rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-lg"></div>
                </div>
                <div className="font-display text-xl">LUME</div>
              </div>
              <p className="text-lume-light leading-relaxed mb-6 max-w-md opacity-80">
                Where boundaries dissolve into brilliance. Building the future of entrepreneurship, 
                one meaningful connection at a time. Join Vancouver's most innovative startup community.
              </p>
              <div className="flex space-x-4">
                <button className="btn-ghost text-white hover:bg-lume-ocean/50">
                  Twitter
                </button>
                <button className="btn-ghost text-white hover:bg-lume-ocean/50">
                  LinkedIn
                </button>
                <button className="btn-ghost text-white hover:bg-lume-ocean/50">
                  Instagram
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-lume-light opacity-80">
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Networking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-lume-light opacity-80">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-lume-ocean/50 pt-8 text-center">
            <p className="text-lume-light opacity-60">
              &copy; 2025 LUME. Where boundaries dissolve into brilliance.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default App;