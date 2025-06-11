import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Users, Filter, Search, Calendar, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getEvents, saveEvent, unsaveEvent, getSavedEvents } from '../lib/supabase';

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
    'Tech & Innovation': '#3B82F6',
    'Funding & Investment': '#10B981',
    'Growth & Marketing': '#F59E0B',
    'Social Impact': '#EF4444'
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
                    font: {
                      size: 12,
                      family: 'SF Pro Text'
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
      <section id="schedule" className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-neutral-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Smart Schedule
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
            Your Personalized
            <span className="block text-gradient">Event Journey</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Navigate the week's events with intelligent filtering, save your favorites, 
            and never miss the sessions that matter to your startup journey.
          </p>
        </div>

        {/* Stats & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
              Events by Track
            </h3>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-display font-semibold text-neutral-800 mb-8">
              Quick Insights
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600 font-medium">Total Events</span>
                <span className="text-2xl font-display font-bold text-neutral-800">{events.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600 font-medium">Active Tracks</span>
                <span className="text-2xl font-display font-bold text-neutral-800">{Object.keys(trackColors).length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600 font-medium">Saved Events</span>
                <span className="text-2xl font-display font-bold text-orange-600">{savedEvents.size}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-elevated p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, speakers, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-neutral-500 mr-2" />
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${savedEvents.has(event.id) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-xl font-display font-semibold text-neutral-800 mb-3 leading-tight">
                    {event.title}
                  </h4>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-neutral-600">
                  <Clock className="w-4 h-4 mr-3 text-neutral-400" />
                  <span className="font-medium">
                    {formatDate(event.start_time)} • {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </span>
                </div>
                <div className="flex items-center text-neutral-600">
                  <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
                  <span>{event.location}</span>
                </div>
                {event.speakers && event.speakers.length > 0 && (
                  <div className="flex items-center text-neutral-600">
                    <Users className="w-4 h-4 mr-3 text-neutral-400" />
                    <span>{event.speakers.join(', ')}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <p className="text-neutral-600 leading-relaxed mb-4">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <button className="btn-ghost text-orange-600 hover:bg-orange-50">
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
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-neutral-800 mb-2">
              No events found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
};