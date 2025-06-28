import React, { useState, useEffect } from 'react';
import { Coffee, Users, MapPin, Clock, Plus, MessageCircle, X, Zap } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import { 
  getNetworkingSignals, 
  createNetworkingSignal, 
  respondToSignal,
  subscribeToTable,
  updateUserLocation,
  getNearbyUsers
} from '../lib/supabase';

interface NetworkingSignal {
  id: string;
  user_id: string;
  signal_type: string;
  message: string;
  location: string | null;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  profiles?: {
    full_name: string | null;
    company: string | null;
  };
}

interface NearbyUser {
  user_id: string;
  full_name: string | null;
  company: string | null;
  venue: string | null;
  distance_km: number;
}

export const NetworkingSignals: React.FC = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState<NetworkingSignal[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [signalForm, setSignalForm] = useState({
    signal_type: 'coffee',
    message: '',
    location: '',
    duration: '4'
  });
  
  const { isOpen: isSignalModalOpen, openModal: openSignalModal, closeModal: closeSignalModal } = useModal();

  const signalTypes = [
    { value: 'coffee', label: 'Coffee Chat', icon: Coffee, color: 'from-lume-warm to-lume-spark' },
    { value: 'lunch', label: 'Lunch Meeting', icon: Users, color: 'from-lume-soft to-lume-glow' },
    { value: 'cowork', label: 'Co-working', icon: MapPin, color: 'from-lume-glow to-lume-soft' },
    { value: 'walk', label: 'Walking Meeting', icon: Clock, color: 'from-lume-spark to-lume-warm' },
    { value: 'chat', label: 'Quick Chat', icon: MessageCircle, color: 'from-lume-glow to-lume-warm' }
  ];

  useEffect(() => {
    loadSignals();
    requestLocation();
    
    // Subscribe to real-time updates
    const subscription = subscribeToTable('networking_signals', (payload) => {
      if (payload.eventType === 'INSERT') {
        setSignals(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setSignals(prev => prev.map(signal => 
          signal.id === payload.new.id ? payload.new : signal
        ));
      } else if (payload.eventType === 'DELETE') {
        setSignals(prev => prev.filter(signal => signal.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyUsers();
    }
  }, [userLocation]);

  const loadSignals = async () => {
    try {
      const { data, error } = await getNetworkingSignals();
      if (error) throw error;
      setSignals(data || []);
    } catch (error) {
      console.error('Error loading signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyUsers = async () => {
    if (!userLocation) return;
    
    try {
      const { data, error } = await getNearbyUsers(userLocation.lat, userLocation.lng, 2);
      if (error) throw error;
      setNearbyUsers(data || []);
    } catch (error) {
      console.error('Error loading nearby users:', error);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (user) {
            await updateUserLocation(user.id, latitude, longitude, 'Vancouver Convention Center');
          }
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const handleSignalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(signalForm.duration));
      
      const { data, error } = await createNetworkingSignal({
        user_id: user.id,
        signal_type: signalForm.signal_type,
        message: signalForm.message,
        location: signalForm.location,
        expires_at: expiresAt.toISOString()
      });
      
      if (error) throw error;
      
      setSignalForm({
        signal_type: 'coffee',
        message: '',
        location: '',
        duration: '4'
      });
      closeSignalModal();
    } catch (error) {
      console.error('Error creating signal:', error);
    }
  };

  const handleRespondToSignal = async (signalId: string, message: string) => {
    if (!user) return;
    
    try {
      await respondToSignal(user.id, signalId, message);
    } catch (error) {
      console.error('Error responding to signal:', error);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ${diffMins}m left`;
    if (diffMins > 0) return `${diffMins}m left`;
    return 'Expired';
  };

  const getSignalTypeInfo = (type: string) => {
    return signalTypes.find(t => t.value === type) || signalTypes[0];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse backdrop-blur-sm">
          <Coffee className="w-6 h-6 text-lume-mist" />
        </div>
        <p className="text-lume-light opacity-80">Loading networking signals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-semibold text-white mb-2">
            Live Networking Signals
          </h3>
          <p className="text-lume-light opacity-80">
            Broadcast your availability and connect with others in real-time
          </p>
        </div>
        {user && (
          <button onClick={openSignalModal} className="btn-light-pulse">
            <Zap className="w-5 h-5" />
            Send Light Pulse
          </button>
        )}
      </div>

      {/* Nearby Users */}
      {nearbyUsers.length > 0 && (
        <div className="luminous-node p-6" style={{ background: 'radial-gradient(circle at center, rgba(30, 58, 95, 0.9), rgba(10, 22, 40, 0.8))' }}>
          <h4 className="font-display font-semibold text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-lume-soft" />
            Nearby Users ({nearbyUsers.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyUsers.map((nearbyUser, index) => (
              <div key={nearbyUser.user_id} className="luminous-node p-4" style={{ background: 'radial-gradient(circle at center, rgba(78, 205, 196, 0.1), rgba(30, 58, 95, 0.8))' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="luminous-avatar w-10 h-10 flex items-center justify-center text-white font-bold text-sm">
                    {nearbyUser.full_name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {nearbyUser.full_name || 'Anonymous'}
                    </div>
                    {nearbyUser.company && (
                      <div className="text-sm text-lume-light opacity-80">{nearbyUser.company}</div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-lume-mist">
                  {nearbyUser.distance_km}km away
                  {nearbyUser.venue && ` • ${nearbyUser.venue}`}
                </div>
                {/* Light bridge to next user */}
                {index < nearbyUsers.length - 1 && index % 3 !== 2 && (
                  <div className="absolute top-1/2 -right-2 w-4 h-0.5 light-bridge"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((signal, index) => {
          const signalType = getSignalTypeInfo(signal.signal_type);
          const Icon = signalType.icon;
          
          return (
            <div 
              key={signal.id} 
              className="luminous-node p-6 animate-scale-in relative"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'radial-gradient(circle at center, rgba(30, 58, 95, 0.9), rgba(10, 22, 40, 0.8))'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${signalType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-lume-mist">
                  {formatTimeRemaining(signal.expires_at)}
                </span>
              </div>
              
              <h4 className="font-display font-semibold text-white mb-2">
                {signalType.label}
              </h4>
              
              <p className="text-lume-light text-sm mb-4 leading-relaxed opacity-90">
                {signal.message}
              </p>
              
              {signal.location && (
                <div className="flex items-center text-lume-light text-sm mb-4 opacity-80">
                  <MapPin className="w-4 h-4 mr-2 text-lume-mist" />
                  {signal.location}
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="luminous-avatar w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                    {signal.profiles?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="text-sm text-lume-light opacity-80">
                    {signal.profiles?.full_name || 'Anonymous'}
                    {signal.profiles?.company && (
                      <span className="text-lume-mist"> • {signal.profiles.company}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {user && user.id !== signal.user_id && (
                <button 
                  onClick={() => handleRespondToSignal(signal.id, 'I\'m interested!')}
                  className="btn-bridge text-sm px-4 py-2 w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bridge Conversation
                </button>
              )}
              
              {/* Light bridges connecting to nearby signals */}
              {index % 3 !== 2 && (
                <div className="absolute top-1/2 -right-3 w-6 h-0.5 light-bridge"></div>
              )}
            </div>
          );
        })}
      </div>

      {signals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Coffee className="w-8 h-8 text-lume-mist" />
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            No active signals
          </h3>
          <p className="text-lume-light mb-6 opacity-80">
            Be the first to broadcast your availability for networking
          </p>
          {user && (
            <button onClick={openSignalModal} className="btn-light-pulse">
              <Zap className="w-5 h-5" />
              Send First Light Pulse
            </button>
          )}
        </div>
      )}

      {/* Create Signal Modal */}
      <Modal isOpen={isSignalModalOpen} onClose={closeSignalModal} title="Broadcast Networking Signal">
        <form onSubmit={handleSignalSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label required">
              Signal Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {signalTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSignalForm({...signalForm, signal_type: type.value})}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      signalForm.signal_type === type.value
                        ? 'border-lume-glow bg-lume-glow/10'
                        : 'border-lume-ocean/50 hover:border-lume-mist/50'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label required">
              Message
            </label>
            <textarea
              placeholder="What would you like to do? Share your interests or what you're looking for..."
              value={signalForm.message}
              onChange={(e) => setSignalForm({...signalForm, message: e.target.value})}
              className="textarea-field"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Convention Center Lobby, Starbucks on Robson"
              value={signalForm.location}
              onChange={(e) => setSignalForm({...signalForm, location: e.target.value})}
              className="input-field"
            />
            <div className="form-help">Optional - helps others find you</div>
          </div>
          
          <div className="form-group">
            <label className="form-label required">
              Duration
            </label>
            <select
              value={signalForm.duration}
              onChange={(e) => setSignalForm({...signalForm, duration: e.target.value})}
              className="select-field"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
            </select>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={closeSignalModal} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-light-pulse flex-1">
              <Zap className="w-4 h-4" />
              Send Light Pulse
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};