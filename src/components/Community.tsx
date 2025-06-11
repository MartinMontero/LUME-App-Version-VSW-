import React, { useState } from 'react';
import { Plus, MapPin, Clock, User, MessageSquare, Heart, Share2, Coffee } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useModal } from '../hooks/useModal';
import { Gathering } from '../types';
import { initialGatheringsData } from '../data/sampleData';

export const Community: React.FC = () => {
  const [gatherings, setGatherings] = useState<Gathering[]>(initialGatheringsData);
  const [gatheringForm, setGatheringForm] = useState({
    name: '',
    location: '',
    time: '',
    description: ''
  });
  
  const { isOpen: isGatheringModalOpen, openModal: openGatheringModal, closeModal: closeGatheringModal } = useModal();

  const handleGatheringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGathering: Gathering = {
      id: Date.now().toString(),
      name: gatheringForm.name,
      location: gatheringForm.location,
      time: gatheringForm.time,
      description: gatheringForm.description,
      timestamp: new Date(),
      organizer: 'You'
    };

    setGatherings([newGathering, ...gatherings]);
    setGatheringForm({ name: '', location: '', time: '', description: '' });
    closeGatheringModal();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <section id="community" className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-medium mb-6">
            <Coffee className="w-4 h-4 mr-2" />
            Community Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
            Beyond the
            <span className="block text-gradient">Official Schedule</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover unofficial meetups, spontaneous gatherings, and community-driven events. 
            Because the best connections often happen outside the official schedule.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Gatherings', value: gatherings.length, color: 'text-green-600' },
            { label: 'Community Members', value: '1.2K+', color: 'text-blue-600' },
            { label: 'Connections Made', value: '450+', color: 'text-purple-600' },
            { label: 'Success Stories', value: '23', color: 'text-orange-600' }
          ].map((stat, index) => (
            <div key={index} className="card-floating p-6 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`text-3xl font-display font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-neutral-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Gatherings Board */}
        <div className="card-elevated p-8 status-live animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-2">
                Informal Gatherings
              </h3>
              <p className="text-neutral-600">
                Join spontaneous meetups and community-organized events
              </p>
            </div>
            <button onClick={openGatheringModal} className="btn-primary">
              <Plus className="w-5 h-5" />
              Create Gathering
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gatherings.map((gathering, index) => (
              <div 
                key={gathering.id} 
                className="card-floating p-6 interactive animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-display font-semibold text-neutral-800 text-lg leading-tight flex-1">
                    {gathering.name}
                  </h4>
                  <span className="text-xs text-neutral-500 ml-4 whitespace-nowrap">
                    {formatTime(gathering.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-neutral-600 text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
                    {gathering.location}
                  </div>
                  <div className="flex items-center text-neutral-600 text-sm">
                    <Clock className="w-4 h-4 mr-3 text-neutral-400" />
                    {gathering.time}
                  </div>
                  <div className="flex items-center text-neutral-600 text-sm">
                    <User className="w-4 h-4 mr-3 text-neutral-400" />
                    Organized by {gathering.organizer}
                  </div>
                </div>
                
                <p className="text-neutral-600 leading-relaxed mb-6 text-sm">
                  {gathering.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-neutral-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">12</span>
                    </button>
                    <button className="flex items-center gap-1 text-neutral-500 hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs">5</span>
                    </button>
                    <button className="text-neutral-500 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button className="btn-primary w-full justify-center">
                  Join Gathering
                </button>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={isGatheringModalOpen} onClose={closeGatheringModal} title="Create a Gathering">
          <form onSubmit={handleGatheringSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gathering Name
              </label>
              <input
                type="text"
                placeholder="e.g., Late Night Startup Stories"
                value={gatheringForm.name}
                onChange={(e) => setGatheringForm({...gatheringForm, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g., 8:00 PM Tonight"
                value={gatheringForm.time}
                onChange={(e) => setGatheringForm({...gatheringForm, time: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="What's this gathering about? What should people expect?"
                value={gatheringForm.description}
                onChange={(e) => setGatheringForm({...gatheringForm, description: e.target.value})}
                className="input-field h-32 resize-none"
                required
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={closeGatheringModal} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create Gathering
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};