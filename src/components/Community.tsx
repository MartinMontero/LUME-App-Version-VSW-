import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, User, MessageSquare, Heart, Share2, Coffee, Users, Zap } from 'lucide-react';
import { Modal } from './ui/Modal';
import { EmptyState } from './ui/EmptyState';
import { ErrorMessage } from './ui/ErrorMessage';
import { SkeletonLoader } from './ui/SkeletonLoader';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getGatherings, createGathering, joinGathering, leaveGathering, subscribeToTable } from '../lib/supabase';

interface Gathering {
  id: string;
  organizer_id: string;
  name: string;
  description: string;
  location: string;
  scheduled_time: string;
  max_attendees: number | null;
  tags: string[] | null;
  attendee_count: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    company: string | null;
  };
}

export const Community: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [gatheringForm, setGatheringForm] = useState({
    name: '',
    location: '',
    scheduled_time: '',
    description: '',
    max_attendees: ''
  });
  
  const { isOpen: isGatheringModalOpen, openModal: openGatheringModal, closeModal: closeGatheringModal } = useModal();

  useEffect(() => {
    loadGatherings();
    
    // Subscribe to real-time updates
    const subscription = subscribeToTable('gatherings', (payload) => {
      if (payload.eventType === 'INSERT') {
        setGatherings(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setGatherings(prev => prev.map(gathering => 
          gathering.id === payload.new.id ? payload.new : gathering
        ));
      } else if (payload.eventType === 'DELETE') {
        setGatherings(prev => prev.filter(gathering => gathering.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadGatherings = async () => {
    try {
      setLoadingError(null);
      const { data, error: fetchError } = await getGatherings();
      if (fetchError) throw fetchError;
      setGatherings(data || []);
    } catch (err: any) {
      setLoadingError(err.message);
      error('Failed to load gatherings', 'Something dimmed unexpectedly');
    } finally {
      setLoading(false);
    }
  };

  const handleGatheringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const { data, error: createError } = await createGathering({
        organizer_id: user.id,
        name: gatheringForm.name,
        location: gatheringForm.location,
        scheduled_time: new Date(gatheringForm.scheduled_time).toISOString(),
        description: gatheringForm.description,
        max_attendees: gatheringForm.max_attendees ? parseInt(gatheringForm.max_attendees) : null
      });
      
      if (createError) throw createError;
      
      setGatheringForm({
        name: '',
        location: '',
        scheduled_time: '',
        description: '',
        max_attendees: ''
      });
      closeGatheringModal();
      success('Light bridge formed!', 'Your gathering has been created successfully');
    } catch (err: any) {
      error('Failed to create gathering', err.message);
    }
  };

  const handleJoinGathering = async (gatheringId: string) => {
    if (!user) return;
    
    try {
      await joinGathering(user.id, gatheringId);
      success('Added to constellation!', 'You\'ve joined the gathering');
    } catch (err: any) {
      error('Failed to join gathering', err.message);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section id="community" className="py-24 px-6 gradient-ocean safe-area-top">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-soft/20 backdrop-blur-sm rounded-full text-lume-soft text-sm font-medium mb-6 border border-lume-soft/20">
            <Coffee className="w-4 h-4 mr-2" />
            Community Hub
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Beyond the
            <span className="block gradient-text">Official Schedule</span>
          </h2>
          <p className="text-lg md:text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
            Discover unofficial meetups, spontaneous gatherings, and community-driven events. 
            Because the best connections often happen outside the official schedule.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Gatherings', value: gatherings.length, color: 'text-lume-soft' },
            { label: 'Community Members', value: '1.2K+', color: 'text-lume-glow' },
            { label: 'Connections Made', value: '450+', color: 'text-lume-warm' },
            { label: 'Success Stories', value: '23', color: 'text-lume-spark' }
          ].map((stat, index) => (
            <div key={index} className="luminous-node p-6 text-center animate-fade-in-scale" style={{ 
              animationDelay: `${index * 0.1}s`,
              background: 'radial-gradient(circle at center, rgba(30, 58, 95, 0.9), rgba(10, 22, 40, 0.8))'
            }}>
              <div className={`text-3xl font-display font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-lume-light text-sm font-medium opacity-80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Gatherings Board */}
        <div className="card-elevated p-6 md:p-8 status-live animate-fade-in-up stagger-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-2">
                Informal Gatherings
              </h3>
              <p className="text-lume-light opacity-80">
                Join spontaneous meetups and community-organized events
              </p>
            </div>
            {user && (
              <button 
                onClick={openGatheringModal} 
                className="btn-constellation w-full md:w-auto"
                aria-label="Create a new gathering"
              >
                <Plus className="w-5 h-5" />
                Create Gathering
              </button>
            )}
          </div>
          
          {loading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : loadingError ? (
            <ErrorMessage 
              message={loadingError}
              onRetry={loadGatherings}
            />
          ) : gatherings.length === 0 ? (
            <EmptyState
              icon={Coffee}
              title="Your light field is quiet"
              description="Share what excites you to see it illuminate. Create the first gathering and watch the community come together around shared interests."
              action={{
                label: user ? 'Create First Gathering' : 'Join to Create Gatherings',
                onClick: user ? openGatheringModal : () => {},
                variant: 'constellation'
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gatherings.map((gathering, index) => (
                <div 
                  key={gathering.id} 
                  className="luminous-node p-6 animate-fade-in-scale relative"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: 'radial-gradient(circle at center, rgba(30, 58, 95, 0.9), rgba(10, 22, 40, 0.8))'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="luminous-avatar w-10 h-10 flex items-center justify-center text-white font-bold text-sm">
                        {gathering.profiles?.full_name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white text-lg leading-tight">
                          {gathering.name}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs text-lume-mist whitespace-nowrap">
                      {formatTime(gathering.created_at)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-lume-light text-sm opacity-90">
                      <MapPin className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      {gathering.location}
                    </div>
                    <div className="flex items-center text-lume-light text-sm opacity-90">
                      <Clock className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      {formatScheduledTime(gathering.scheduled_time)}
                    </div>
                    <div className="flex items-center text-lume-light text-sm opacity-90">
                      <User className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      Organized by {gathering.profiles?.full_name || 'Anonymous'}
                      {gathering.profiles?.company && (
                        <span className="ml-1">• {gathering.profiles.company}</span>
                      )}
                    </div>
                    <div className="flex items-center text-lume-light text-sm opacity-90">
                      <Users className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      {gathering.attendee_count} attending
                      {gathering.max_attendees && ` / ${gathering.max_attendees} max`}
                    </div>
                  </div>
                  
                  <p className="text-lume-light leading-relaxed mb-6 text-sm opacity-90">
                    {gathering.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button 
                        className="flex items-center gap-1 text-lume-mist hover:text-lume-spark transition-colors focus-ring"
                        aria-label="Like this gathering"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">12</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 text-lume-mist hover:text-lume-glow transition-colors focus-ring"
                        aria-label="View comments"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">5</span>
                      </button>
                      <button 
                        className="text-lume-mist hover:text-lume-soft transition-colors focus-ring"
                        aria-label="Share gathering"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleJoinGathering(gathering.id)}
                    className="btn-constellation w-full justify-center"
                    disabled={!user}
                    aria-label={`Join ${gathering.name} gathering`}
                  >
                    <Users className="w-4 h-4" />
                    Add to Constellation
                  </button>
                  
                  {/* Light bridges connecting to nearby gatherings */}
                  {index % 3 !== 2 && (
                    <div className="absolute top-1/2 -right-3 w-6 h-0.5 light-bridge" aria-hidden="true"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal isOpen={isGatheringModalOpen} onClose={closeGatheringModal} title="Create a Gathering">
          <form onSubmit={handleGatheringSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label required">
                Gathering Name
              </label>
              <input
                type="text"
                placeholder="e.g., Late Night Startup Stories"
                value={gatheringForm.name}
                onChange={(e) => setGatheringForm({...gatheringForm, name: e.target.value})}
                className="input-field"
                required
                aria-describedby="name-help"
              />
              <div id="name-help" className="form-help">
                Choose a descriptive name that captures the essence of your gathering
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label required">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Coffee Shop on Robson"
                value={gatheringForm.location}
                onChange={(e) => setGatheringForm({...gatheringForm, location: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label required">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={gatheringForm.scheduled_time}
                  onChange={(e) => setGatheringForm({...gatheringForm, scheduled_time: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Max Attendees
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={gatheringForm.max_attendees}
                  onChange={(e) => setGatheringForm({...gatheringForm, max_attendees: e.target.value})}
                  className="input-field"
                  min="1"
                />
                <div className="form-help">Optional - leave blank for unlimited</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label required">
                Description
              </label>
              <textarea
                placeholder="What's this gathering about? What should people expect?"
                value={gatheringForm.description}
                onChange={(e) => setGatheringForm({...gatheringForm, description: e.target.value})}
                className="textarea-field"
                required
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={closeGatheringModal} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-constellation flex-1">
                <Zap className="w-4 h-4" />
                Create Gathering
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};