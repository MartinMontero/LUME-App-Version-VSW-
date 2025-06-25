import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Schedule } from './components/Schedule';
import { Networking } from './components/Networking';
import { Community } from './components/Community';
import { Approach } from './components/Approach';
import { AuthModal } from './components/Auth/AuthModal';
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h3 className="text-xl font-display font-semibold text-neutral-800 mb-2">
            Lume
          </h3>
          <p className="text-neutral-600">Loading your experience...</p>
          <div className="mt-6 w-48 h-1 bg-neutral-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navigation user={user} onAuthClick={openAuthModal} />
      <main>
        <Home onAuthClick={openAuthModal} />
        <Schedule />
        <Networking />
        <Community />
        <Approach />
      </main>
      
      <footer className="bg-neutral-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-lg"></div>
                </div>
                <div className="font-display text-xl">Lume</div>
              </div>
              <p className="text-neutral-300 leading-relaxed mb-6 max-w-md">
                Building the future of entrepreneurship, one meaningful connection at a time. 
                Join Vancouver's most innovative startup community.
              </p>
              <div className="flex space-x-4">
                <button className="btn-ghost text-white hover:bg-neutral-700">
                  Twitter
                </button>
                <button className="btn-ghost text-white hover:bg-neutral-700">
                  LinkedIn
                </button>
                <button className="btn-ghost text-white hover:bg-neutral-700">
                  Instagram
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Networking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-8 text-center">
            <p className="text-neutral-400">
              &copy; 2025 Lume. Crafted with care for meaningful connections.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default App;