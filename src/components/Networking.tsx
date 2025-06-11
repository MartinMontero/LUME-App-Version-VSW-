import React, { useState, useEffect } from 'react';
import { Radio, Search, Coffee, Plus, MessageCircle, Users, Zap, ArrowRight, Heart } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import { getPitches, createPitch, likePitch, unlikePitch, subscribeToTable } from '../lib/supabase';

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
  const [pitchForm, setPitchForm] = useState({
    title: '',
    description: '',
    contact_info: '',
    stage: 'idea',
    industry: '',
    looking_for: [] as string[]
  });
  
  const { isOpen: isPitchModalOpen, openModal: openPitchModal, closeModal: closePitchModal } = useModal();

  useEffect(() => {
    loadPitches();
    
    // Subscribe to real-time updates
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
  }, []);

  const loadPitches = async () => {
    try {
      const { data, error } = await getPitches();
      if (error) throw error;
      setPitches(data || []);
    } catch (error) {
      console.error('Error loading pitches:', error);
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
      
      if (error) throw error;
      
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
      await likePitch(user.id, pitchId);
    } catch (error) {
      console.error('Error liking pitch:', error);
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

  const networkingSteps = [
    {
      icon: Radio,
      title: 'Broadcast Your Interest',
      description: 'Share what you\'re looking for - co-founders, advisors, customers, or great conversations.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Search,
      title: 'Discover & Connect',
      description: 'AI matches you with people nearby who have complementary interests or overlapping needs.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Coffee,
      title: 'Spontaneous Meetups',
      description: 'Turn digital signals into real conversations over coffee or during session breaks.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="networking" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Smart Networking
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
            The Serendipity
            <span className="block text-gradient">Multiplier</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
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
                <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
                {index < networkingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-neutral-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pitch Board */}
        <div className="card-elevated p-8 status-live animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-2">
                Pitch & Connect Board
              </h3>
              <p className="text-neutral-600">
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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Zap className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-neutral-600">Loading pitches...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pitches.map((pitch, index) => (
                <div 
                  key={pitch.id} 
                  className="card-floating p-6 interactive animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-display font-semibold text-neutral-800 text-lg leading-tight flex-1">
                      {pitch.title}
                    </h4>
                    <span className="text-xs text-neutral-500 ml-4 whitespace-nowrap">
                      {formatTime(pitch.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-neutral-600 leading-relaxed mb-4 text-sm">
                    {pitch.description}
                  </p>
                  
                  {pitch.stage && (
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {pitch.stage}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-neutral-500">
                      <Users className="w-4 h-4 mr-2" />
                      by {pitch.profiles?.full_name || 'Anonymous'}
                      {pitch.profiles?.company && (
                        <span className="ml-1">• {pitch.profiles.company}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLikePitch(pitch.id)}
                        className="flex items-center gap-1 text-neutral-500 hover:text-red-500 transition-colors"
                        disabled={!user}
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{pitch.likes_count}</span>
                      </button>
                      <button className="flex items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">{pitch.comments_count}</span>
                      </button>
                    </div>
                    <button className="btn-secondary text-sm px-3 py-1">
                      Connect
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="text-xs text-orange-600 font-medium">
                      {pitch.contact_info}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal isOpen={isPitchModalOpen} onClose={closePitchModal} title="Share Your Pitch">
          <form onSubmit={handlePitchSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                <label className="block text-sm font-medium text-neutral-700 mb-2">
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
      </div>
    </section>
  );
};