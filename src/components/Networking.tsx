import React, { useState, useEffect } from 'react';
import { Radio, Search, Coffee, Plus, MessageCircle, Users, Zap, ArrowRight, Heart, Eye, ThumbsUp, Share2, LogIn } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import { getPitches, createPitch, likePitch, unlikePitch, subscribeToTable } from '../lib/supabase';
import { NetworkingSignals } from './NetworkingSignals';

interface Pitch {
  id: string;
  user_id: string;
  title: string;
  description: string;
  contact_info: string;
  tags: string[] | null;
  looking_for: string[] | null;
  stage: string | null;
  industry: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    company: string | null;
  };
}

export const Networking: React.FC = () => {
  const { user } = useAuth();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [likedPitches, setLikedPitches] = useState<Set<string>>(new Set());
  const [pitchForm, setPitchForm] = useState({
    title: '',
    description: '',
    contact_info: '',
    stage: 'idea',
    industry: '',
    looking_for: [] as string[]
  });
  
  const { isOpen: isPitchModalOpen, openModal: openPitchModal, closeModal: closePitchModal } = useModal();
  const { isOpen: isPitchDetailOpen, openModal: openPitchDetail, closeModal: closePitchDetail } = useModal();

  useEffect(() => {
    if (user) {
      loadPitches();
      
      // Subscribe to real-time updates only if user is authenticated
      const subscription = subscribeToTable('pitches', (payload) => {
        if (payload.eventType === 'INSERT') {
          setPitches(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setPitches(prev => prev.map(pitch => 
            pitch.id === payload.new.id ? payload.new : pitch
          ));
        } else if (payload.eventType === 'DELETE') {
          setPitches(prev => prev.filter(pitch => pitch.id !== payload.old.id));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // User is not authenticated, clear data and set appropriate state
      setPitches([]);
      setLoadingError('Authentication required to view pitches');
      setLoading(false);
    }
  }, [user]);

  const loadPitches = async () => {
    try {
      setLoadingError(null);
      const { data, error } = await getPitches();
      if (error) {
        setLoadingError(error);
        setPitches([]);
        return;
      }
      setPitches(data || []);
    } catch (error) {
      console.error('Error loading pitches:', error);
      setLoadingError('Failed to load pitches');
      setPitches([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const { data, error } = await createPitch({
        user_id: user.id,
        ...pitchForm
      });
      
      if (error) {
        console.error('Error creating pitch:', error);
        return;
      }
      
      setPitchForm({
        title: '',
        description: '',
        contact_info: '',
        stage: 'idea',
        industry: '',
        looking_for: []
      });
      closePitchModal();
    } catch (error) {
      console.error('Error creating pitch:', error);
    }
  };

  const handleLikePitch = async (pitchId: string) => {
    if (!user) return;
    
    try {
      const isLiked = likedPitches.has(pitchId);
      
      if (isLiked) {
        const { error } = await unlikePitch(user.id, pitchId);
        if (error) {
          console.error('Error unliking pitch:', error);
          return;
        }
        setLikedPitches(prev => {
          const newSet = new Set(prev);
          newSet.delete(pitchId);
          return newSet;
        });
      } else {
        const { error } = await likePitch(user.id, pitchId);
        if (error) {
          console.error('Error liking pitch:', error);
          return;
        }
        setLikedPitches(prev => new Set(prev).add(pitchId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openPitchDetailModal = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    openPitchDetail();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const networkingSteps = [
    {
      icon: Radio,
      title: 'Broadcast Your Interest',
      description: 'Share what you\'re looking for - co-founders, advisors, customers, or great conversations.',
      color: 'from-lume-glow to-lume-soft'
    },
    {
      icon: Search,
      title: 'Discover & Connect',
      description: 'AI matches you with people nearby who have complementary interests or overlapping needs.',
      color: 'from-lume-warm to-lume-spark'
    },
    {
      icon: Coffee,
      title: 'Spontaneous Meetups',
      description: 'Turn digital signals into real conversations over coffee or during session breaks.',
      color: 'from-lume-soft to-lume-glow'
    }
  ];

  const renderPitchContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse backdrop-blur-sm">
            <Zap className="w-6 h-6 text-lume-mist" />
          </div>
          <p className="text-lume-light opacity-80">Loading pitches...</p>
        </div>
      );
    }

    if (loadingError) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <LogIn className="w-8 h-8 text-lume-glow" />
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-3">
            Sign In to View Pitches
          </h3>
          <p className="text-lume-light opacity-80 mb-6 max-w-md mx-auto">
            Connect with entrepreneurs and discover exciting startup opportunities. 
            Authentication is required to access the pitch board.
          </p>
          <button className="btn-primary">
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      );
    }

    if (pitches.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <MessageCircle className="w-8 h-8 text-lume-glow" />
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-3">
            No Pitches Yet
          </h3>
          <p className="text-lume-light opacity-80 mb-6">
            Be the first to share your startup pitch and connect with potential co-founders!
          </p>
          {user && (
            <button onClick={openPitchModal} className="btn-primary">
              <Plus className="w-4 h-4" />
              Share Your Pitch
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitches.map((pitch, index) => (
          <div 
            key={pitch.id} 
            className="luminous-node p-6 cursor-pointer animate-scale-in"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              background: 'radial-gradient(circle at center, rgba(30, 58, 95, 0.9), rgba(10, 22, 40, 0.8))'
            }}
            onClick={() => openPitchDetailModal(pitch)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="luminous-avatar w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                  {pitch.profiles?.full_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white text-lg leading-tight">
                    {pitch.title}
                  </h4>
                  <p className="text-lume-light text-sm opacity-80">
                    by {pitch.profiles?.full_name || 'Anonymous'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-lume-mist">
                {formatTime(pitch.created_at)}
              </span>
            </div>
            
            <p className="text-lume-light leading-relaxed mb-4 text-sm line-clamp-3 opacity-90">
              {pitch.description}
            </p>
            
            <div className="flex items-center gap-2 mb-4">
              {pitch.stage && (
                <span className="inline-block px-2 py-1 bg-lume-glow/20 text-lume-glow text-xs font-medium rounded-full border border-lume-glow/30">
                  {pitch.stage}
                </span>
              )}
              {pitch.industry && (
                <span className="inline-block px-2 py-1 bg-lume-soft/20 text-lume-soft text-xs font-medium rounded-full border border-lume-soft/30">
                  {pitch.industry}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikePitch(pitch.id);
                  }}
                  className={`flex items-center gap-1 transition-colors ${
                    likedPitches.has(pitch.id) 
                      ? 'text-lume-spark' 
                      : 'text-lume-mist hover:text-lume-spark'
                  }`}
                  disabled={!user}
                >
                  <Heart className={`w-4 h-4 ${likedPitches.has(pitch.id) ? 'fill-current' : ''}`} />
                  <span className="text-xs">{pitch.likes_count}</span>
                </button>
                <button className="flex items-center gap-1 text-lume-mist hover:text-lume-glow transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{pitch.comments_count}</span>
                </button>
                <button className="flex items-center gap-1 text-lume-mist hover:text-lume-warm transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">View</span>
                </button>
              </div>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="text-lume-mist hover:text-lume-glow transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Light bridges connecting to nearby cards */}
            {index % 3 !== 2 && (
              <div className="absolute top-1/2 -right-3 w-6 h-0.5 light-bridge"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id="networking" className="py-24 px-6 bg-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-spark/20 backdrop-blur-sm rounded-full text-lume-spark text-sm font-medium mb-6 border border-lume-spark/20">
            <Zap className="w-4 h-4 mr-2" />
            Smart Networking
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            The Serendipity
            <span className="block gradient-text">Multiplier</span>
          </h2>
          <p className="text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
            Leverage the power of weak ties and serendipitous encounters. Broadcasting your interests 
            and availability creates unexpected opportunities that traditional networking can't match.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 relative">
          {networkingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center animate-slide-up relative" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-display font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lume-light leading-relaxed opacity-80">
                  {step.description}
                </p>
                {index < networkingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 transform translate-x-1/2">
                    <div className="light-bridge w-8"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Networking Signals */}
        <div className="card-elevated p-8 status-live animate-slide-up mb-12" style={{ animationDelay: '0.3s' }}>
          <NetworkingSignals />
        </div>

        {/* Pitch Board */}
        <div className="card-elevated p-8 status-live animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-display font-semibold text-white mb-2">
                Pitch & Connect Board
              </h3>
              <p className="text-lume-light opacity-80">
                Share your startup pitch or find your next co-founder
              </p>
            </div>
            {user && (
              <button onClick={openPitchModal} className="btn-primary">
                <Plus className="w-5 h-5" />
                Add Your Pitch
              </button>
            )}
          </div>
          
          {renderPitchContent()}
        </div>

        {/* Create Pitch Modal */}
        <Modal isOpen={isPitchModalOpen} onClose={closePitchModal} title="Share Your Pitch">
          <form onSubmit={handlePitchSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-lume-light mb-2">
                Pitch Title
              </label>
              <input
                type="text"
                placeholder="e.g., EcoTrack - Carbon Footprint App"
                value={pitchForm.title}
                onChange={(e) => setPitchForm({...pitchForm, title: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-lume-light mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your startup, what problem you're solving, and what you're looking for..."
                value={pitchForm.description}
                onChange={(e) => setPitchForm({...pitchForm, description: e.target.value})}
                className="input-field h-32 resize-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-lume-light mb-2">
                  Stage
                </label>
                <select
                  value={pitchForm.stage}
                  onChange={(e) => setPitchForm({...pitchForm, stage: e.target.value})}
                  className="input-field"
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="mvp">MVP</option>
                  <option value="growth">Growth</option>
                  <option value="scale">Scale</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-lume-light mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g., FinTech, HealthTech"
                  value={pitchForm.industry}
                  onChange={(e) => setPitchForm({...pitchForm, industry: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-lume-light mb-2">
                Contact Information
              </label>
              <input
                type="text"
                placeholder="Email, LinkedIn, or preferred contact method"
                value={pitchForm.contact_info}
                onChange={(e) => setPitchForm({...pitchForm, contact_info: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={closePitchModal} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Share Pitch
              </button>
            </div>
          </form>
        </Modal>

        {/* Pitch Detail Modal */}
        <Modal 
          isOpen={isPitchDetailOpen} 
          onClose={closePitchDetail} 
          title={selectedPitch?.title || 'Pitch Details'}
        >
          {selectedPitch && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="luminous-avatar w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                  {selectedPitch.profiles?.full_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold text-white">
                    {selectedPitch.profiles?.full_name || 'Anonymous'}
                  </h4>
                  {selectedPitch.profiles?.company && (
                    <p className="text-lume-light opacity-80">{selectedPitch.profiles.company}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                {selectedPitch.stage && (
                  <span className="inline-block px-3 py-1 bg-lume-glow/20 text-lume-glow text-sm font-medium rounded-full border border-lume-glow/30">
                    {selectedPitch.stage}
                  </span>
                )}
                {selectedPitch.industry && (
                  <span className="inline-block px-3 py-1 bg-lume-soft/20 text-lume-soft text-sm font-medium rounded-full border border-lume-soft/30">
                    {selectedPitch.industry}
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Description</h4>
                <p className="text-lume-light leading-relaxed opacity-90">
                  {selectedPitch.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Contact</h4>
                <p className="text-lume-glow font-medium">
                  {selectedPitch.contact_info}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-lume-ocean/50">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleLikePitch(selectedPitch.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPitches.has(selectedPitch.id) 
                        ? 'text-lume-spark' 
                        : 'text-lume-mist hover:text-lume-spark'
                    }`}
                    disabled={!user}
                  >
                    <Heart className={`w-5 h-5 ${likedPitches.has(selectedPitch.id) ? 'fill-current' : ''}`} />
                    <span>{selectedPitch.likes_count} likes</span>
                  </button>
                  <div className="flex items-center gap-2 text-lume-mist">
                    <MessageCircle className="w-5 h-5" />
                    <span>{selectedPitch.comments_count} comments</span>
                  </div>
                </div>
                
                <button className="btn-bridge">
                  <MessageCircle className="w-4 h-4" />
                  Bridge Conversation
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};