import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Users, Filter, Calendar, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getEvents, saveEvent, unsaveEvent, getSavedEvents } from '../lib/supabase';
import { NaturalRhythms } from './NaturalRhythms';

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string;
  track: string;
  speakers: string[] | null;
  capacity: number | null;
  registration_url: string | null;
  tags: string[] | null;
}

type TrackFilter = 'All' | 'Tech & Innovation' | 'Funding & Investment' | 'Growth & Marketing' | 'Social Impact';

export const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<TrackFilter>('All');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const filters: TrackFilter[] = ['All', 'Tech & Innovation', 'Funding & Investment', 'Growth & Marketing', 'Social Impact'];

  const trackColors = {
    'Tech & Innovation': 'var(--lume-glow)',
    'Funding & Investment': 'var(--lume-soft)',
    'Growth & Marketing': 'var(--lume-warm)',
    'Social Impact': 'var(--lume-spark)'
  };

  useEffect(() => {
    loadEvents();
    if (user) {
      loadSavedEvents();
    }
  }, [user]);

  useEffect(() => {
    let filtered = events;
    
    if (activeFilter !== 'All') {
      filtered = filtered.filter(event => event.track === activeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.speakers?.some(speaker => speaker.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredEvents(filtered);
  }, [activeFilter, searchQuery, events]);

  useEffect(() => {
    if (chartRef.current && events.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        import('chart.js/auto').then((Chart) => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }

          const trackCounts = Object.keys(trackColors).map(track => 
            events.filter(event => event.track === track).length
          );

          chartInstanceRef.current = new Chart.default(ctx, {
            type: 'doughnut',
            data: {
              labels: Object.keys(trackColors),
              datasets: [{
                data: trackCounts,
                backgroundColor: Object.values(trackColors).map(color => color + '40'),
                borderColor: Object.values(trackColors),
                borderWidth: 3,
                hoverBorderWidth: 4,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    color: 'var(--lume-light)',
                    font: {
                      size: 12,
                      family: 'Inter'
                    }
                  }
                }
              },
              cutout: '60%',
            }
          });
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [events]);

  const loadEvents = async () => {
    try {
      const { data, error } = await getEvents();
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getSavedEvents(user.id);
      if (error) throw error;
      setSavedEvents(new Set(data?.map(save => save.event_id) || []));
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  const toggleSaveEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const newSavedEvents = new Set(savedEvents);
      if (newSavedEvents.has(eventId)) {
        await unsaveEvent(user.id, eventId);
        newSavedEvents.delete(eventId);
      } else {
        await saveEvent(user.id, eventId);
        newSavedEvents.add(eventId);
      }
      setSavedEvents(newSavedEvents);
    } catch (error) {
      console.error('Error toggling event save:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="schedule" className="py-24 px-6 gradient-ocean">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 gradient-aurora rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-lume-light">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" className="py-24 px-6 gradient-ocean">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-lume-glow/20 backdrop-blur-sm rounded-full text-lume-glow text-sm font-medium mb-6 border border-lume-glow/20">
            <Calendar className="w-4 h-4 mr-2" />
            Smart Schedule
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Your Personalized
            <span className="block gradient-text">Event Journey</span>
          </h2>
          <p className="text-xl text-lume-light max-w-3xl mx-auto leading-relaxed opacity-90">
            Navigate the week's events with intelligent filtering, save your favorites, 
            and never miss the sessions that matter to your startup journey.
          </p>
        </div>

        {/* Main Content Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Natural Rhythms */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <NaturalRhythms />
            </div>
            
            {/* Quick Insights */}
            <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-display font-semibold text-white mb-6">
                Quick Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-lume-ocean/30 rounded-xl backdrop-blur-sm">
                  <span className="text-lume-light font-medium text-sm">Total Events</span>
                  <span className="text-xl font-display font-bold text-white">{events.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-lume-ocean/30 rounded-xl backdrop-blur-sm">
                  <span className="text-lume-light font-medium text-sm">Active Tracks</span>
                  <span className="text-xl font-display font-bold text-white">{Object.keys(trackColors).length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-lume-ocean/30 rounded-xl backdrop-blur-sm">
                  <span className="text-lume-light font-medium text-sm">Saved Events</span>
                  <span className="text-xl font-display font-bold gradient-text">{savedEvents.size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Chart */}
            <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-display font-semibold text-white mb-6">
                Events by Track
              </h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* Serendipity Multiplier and Filters */}
            <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Serendipity Multiplier */}
                <div className="flex-1 max-w-md">
                  <div className="serendipity-container flex items-center gap-4">
                    <div className="text-2xl">✨</div>
                    <input
                      type="text"
                      placeholder="What's exciting you today?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="serendipity-input"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-5 h-5 text-lume-mist mr-2" />
                  {filters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeFilter === filter 
                          ? 'gradient-aurora text-white shadow-lg' 
                          : 'bg-lume-ocean/30 text-lume-light hover:bg-lume-ocean/50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="card-elevated p-6 interactive animate-slide-up"
                  style={{ animationDelay: `${0.1 * (index % 6)}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: trackColors[event.track as keyof typeof trackColors] }}
                        >
                          {event.track}
                        </span>
                        {user && (
                          <button
                            onClick={() => toggleSaveEvent(event.id)}
                            className={`p-1 rounded-full transition-colors ${
                              savedEvents.has(event.id) 
                                ? 'text-lume-warm hover:text-lume-warm/80' 
                                : 'text-lume-mist hover:text-lume-light'
                            }`}
                          >
                            <Star className={`w-5 h-5 ${savedEvents.has(event.id) ? 'fill-current' : ''}`} />
                          </button>
                        )}
                      </div>
                      <h4 className="text-xl font-display font-semibold text-white mb-3 leading-tight">
                        {event.title}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-lume-light">
                      <Clock className="w-4 h-4 mr-3 text-lume-mist" />
                      <span className="font-medium">
                        {formatDate(event.start_time)} • {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-lume-light">
                      <MapPin className="w-4 h-4 mr-3 text-lume-mist" />
                      <span>{event.location}</span>
                    </div>
                    {event.speakers && event.speakers.length > 0 && (
                      <div className="flex items-center text-lume-light">
                        <Users className="w-4 h-4 mr-3 text-lume-mist" />
                        <span>{event.speakers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-lume-light leading-relaxed mb-4 opacity-80">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <button className="btn-ghost text-lume-glow hover:bg-lume-glow/10">
                      View Details
                    </button>
                    <button className="btn-secondary">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-lume-ocean/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-lume-mist" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  No events found
                </h3>
                <p className="text-lume-light opacity-80">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};