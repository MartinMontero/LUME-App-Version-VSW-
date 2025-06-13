import React, { useState, useEffect } from 'react';
import { Coffee, Users, MapPin, Clock, Plus, MessageCircle, X } from 'lucide-react';
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
    { value: 'coffee', label: 'Coffee Chat', icon: Coffee, color: 'from-amber-500 to-orange-500' },
    { value: 'lunch', label: 'Lunch Meeting', icon: Users, color: 'from-green-500 to-emerald-500' },
    { value: 'cowork', label: 'Co-working', icon: MapPin, color: 'from-blue-500 to-indigo-500' },
    { value: 'walk', label: 'Walking Meeting', icon: Clock, color: 'from-purple-500 to-pink-500' },
    { value: 'chat', label: 'Quick Chat', icon: MessageCircle, color: 'from-red-500 to-rose-500' }
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
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Coffee className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-600">Loading networking signals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-2">
            Live Networking Signals
          </h3>
          <p className="text-neutral-600">
            Broadcast your availability and connect with others in real-time
          </p>
        </div>
        {user && (
          <button onClick={openSignalModal} className="btn-primary">
            <Plus className="w-5 h-5" />
            Broadcast Signal
          </button>
        )}
      </div>

      {/* Nearby Users */}
      {nearbyUsers.length > 0 && (
        <div className="card-floating p-6">
          <h4 className="font-display font-semibold text-neutral-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-500" />
            Nearby Users ({nearbyUsers.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyUsers.map((nearbyUser) => (
              <div key={nearbyUser.user_id} className="p-4 bg-neutral-50 rounded-lg">
                <div className="font-medium text-neutral-800">
                  {nearbyUser.full_name || 'Anonymous'}
                </div>
                {nearbyUser.company && (
                  <div className="text-sm text-neutral-600">{nearbyUser.company}</div>
                )}
                <div className="text-xs text-neutral-500 mt-1">
                  {nearbyUser.distance_km}km away
                  {nearbyUser.venue && ` • ${nearbyUser.venue}`}
                </div>
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
              className="card-floating p-6 interactive animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${signalType.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-neutral-500">
                  {formatTimeRemaining(signal.expires_at)}
                </span>
              </div>
              
              <h4 className="font-display font-semibold text-neutral-800 mb-2">
                {signalType.label}
              </h4>
              
              <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                {signal.message}
              </p>
              
              {signal.location && (
                <div className="flex items-center text-neutral-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {signal.location}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  by {signal.profiles?.full_name || 'Anonymous'}
                  {signal.profiles?.company && (
                    <span className="text-neutral-400"> • {signal.profiles.company}</span>
                  )}
                </div>
                
                {user && user.id !== signal.user_id && (
                  <button 
                    onClick={() => handleRespondToSignal(signal.id, 'I\'m interested!')}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Respond
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {signals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-neutral-800 mb-2">
            No active signals
          </h3>
          <p className="text-neutral-600 mb-6">
            Be the first to broadcast your availability for networking
          </p>
          {user && (
            <button onClick={openSignalModal} className="btn-primary">
              <Plus className="w-5 h-5" />
              Create First Signal
            </button>
          )}
        </div>
      )}

      {/* Create Signal Modal */}
      <Modal isOpen={isSignalModalOpen} onClose={closeSignalModal} title="Broadcast Networking Signal">
        <form onSubmit={handleSignalSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
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
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-medium text-neutral-800">
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message
            </label>
            <textarea
              placeholder="What would you like to do? Share your interests or what you're looking for..."
              value={signalForm.message}
              onChange={(e) => setSignalForm({...signalForm, message: e.target.value})}
              className="input-field h-24 resize-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Convention Center Lobby, Starbucks on Robson"
              value={signalForm.location}
              onChange={(e) => setSignalForm({...signalForm, location: e.target.value})}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Duration
            </label>
            <select
              value={signalForm.duration}
              onChange={(e) => setSignalForm({...signalForm, duration: e.target.value})}
              className="input-field"
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
            <button type="submit" className="btn-primary flex-1">
              Broadcast Signal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};