import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Users, Filter, Calendar, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { getEvents, saveEvent, unsaveEvent, getSavedEvents } from '../lib/supabase';
import { formatTime, formatDate, createStaggerDelay, triggerHaptic } from '../utils';
import { TRACK_COLORS } from '../constants';
import { NaturalRhythms } from './NaturalRhythms';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Section } from './common/Section';
import { SectionHeader } from './common/SectionHeader';
import { Card } from './common/Card';
import { Button } from './forms/Button';
import { Input } from './forms/FormField';
import { EmptyState } from './ui/EmptyState';
import { ErrorMessage } from './ui/ErrorMessage';
import { SkeletonLoader } from './ui/SkeletonLoader';

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
  const { success, error } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<TrackFilter>('All');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const filters: TrackFilter[] = ['All', 'Tech & Innovation', 'Funding & Investment', 'Growth & Marketing', 'Social Impact'];

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
    
    if (debouncedSearchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        event.speakers?.some(speaker => speaker.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
    }
    
    setFilteredEvents(filtered);
  }, [activeFilter, debouncedSearchQuery, events]);

  useEffect(() => {
    if (chartRef.current && events.length > 0) {
      createChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [events]);

  const createChart = async () => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    const Chart = await import('chart.js/auto');
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const trackCounts = Object.keys(TRACK_COLORS).map(track => 
      events.filter(event => event.track === track).length
    );

    chartInstanceRef.current = new Chart.default(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(TRACK_COLORS),
        datasets: [{
          data: trackCounts,
          backgroundColor: Object.values(TRACK_COLORS).map(color => color + '40'),
          borderColor: Object.values(TRACK_COLORS),
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
  };

  const loadEvents = async () => {
    try {
      setLoadingError(null);
      const { data, error: fetchError } = await getEvents();
      if (fetchError) {
        setLoadingError(fetchError);
        return;
      }
      setEvents(data || []);
    } catch (err: any) {
      setLoadingError(err.message || 'Failed to load events');
      error('Failed to load events', 'Something dimmed unexpectedly');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error: fetchError } = await getSavedEvents(user.id);
      if (fetchError) {
        error('Failed to load saved events', fetchError);
        return;
      }
      setSavedEvents(new Set(data?.map(save => save.event_id) || []));
    } catch (err: any) {
      error('Failed to load saved events', err.message);
    }
  };

  const toggleSaveEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const newSavedEvents = new Set(savedEvents);
      if (newSavedEvents.has(eventId)) {
        const { error: unsaveError } = await unsaveEvent(user.id, eventId);
        if (unsaveError) {
          error('Failed to remove event', unsaveError);
          return;
        }
        newSavedEvents.delete(eventId);
        success('Event removed from constellation');
      } else {
        const { error: saveError } = await saveEvent(user.id, eventId);
        if (saveError) {
          error('Failed to save event', saveError);
          return;
        }
        newSavedEvents.add(eventId);
        success('Light bridge formed!', 'Event added to your constellation');
      }
      setSavedEvents(newSavedEvents);
      triggerHaptic('light');
    } catch (err: any) {
      error('Failed to save event', err.message);
    }
  };

  const handleFilterClick = (filter: TrackFilter) => {
    setActiveFilter(filter);
    triggerHaptic('light');
  };

  if (loading) {
    return (
      <Section id="schedule" background="ocean">
        <LoadingSpinner message="Loading events..." />
      </Section>
    );
  }

  return (
    <Section id="schedule" background="ocean">
      <SectionHeader
        badge={{
          icon: Calendar,
          text: 'Smart Schedule',
          color: 'lume-glow'
        }}
        title="Your Personalized"
        subtitle="Event Journey"
        description="Navigate the week's events with intelligent filtering, save your favorites, and never miss the sessions that matter to your startup journey."
      />

      {/* Main Content Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Natural Rhythms */}
          <div className="animate-fade-in-left stagger-1">
            <NaturalRhythms />
          </div>
          
          {/* Quick Insights */}
          <Card variant="elevated" className="p-6 animate-fade-in-left stagger-2">
            <h3 className="text-lg font-display font-semibold text-white mb-6">
              Quick Insights
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Events', value: events.length, color: 'text-white' },
                { label: 'Active Tracks', value: Object.keys(TRACK_COLORS).length, color: 'text-white' },
                { label: 'Saved Events', value: savedEvents.size, color: 'gradient-text' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-lume-ocean/30 rounded-xl backdrop-blur-sm">
                  <span className="text-lume-light font-medium text-sm">{stat.label}</span>
                  <span className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Chart */}
          {events.length > 0 && (
            <Card variant="elevated" className="p-6 md:p-8 animate-fade-in-right stagger-3">
              <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-6">
                Events by Track
              </h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </Card>
          )}

          {/* Search and Filters */}
          <Card variant="elevated" className="p-6 md:p-8 animate-fade-in-right stagger-4">
            <div className="flex flex-col gap-6">
              {/* Search */}
              <div className="serendipity-container">
                <div className="text-2xl mr-3" aria-hidden="true">✨</div>
                <Input
                  type="text"
                  placeholder="What's exciting you today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="serendipity-input"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-lume-mist mr-2" aria-hidden="true" />
                {filters.map(filter => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? 'constellation' : 'ghost'}
                    size="sm"
                    onClick={() => handleFilterClick(filter)}
                    className="min-h-[44px]"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Events Grid */}
          {loadingError ? (
            <ErrorMessage 
              message={loadingError}
              onRetry={loadEvents}
            />
          ) : filteredEvents.length === 0 && events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Your light field is quiet"
              description="No events are currently available. Check back soon as new sessions are added regularly."
              action={{
                label: 'Refresh Events',
                onClick: loadEvents,
                variant: 'constellation'
              }}
            />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No matching events found"
              description="Try adjusting your search or filter criteria to discover more events that align with your interests."
              action={{
                label: 'Clear Filters',
                onClick: () => {
                  setActiveFilter('All');
                  setSearchQuery('');
                },
                variant: 'secondary'
              }}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event.id}
                  variant="elevated"
                  interactive
                  className="p-6 animate-fade-in-scale"
                  style={{ animationDelay: createStaggerDelay(index % 6) }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span 
                          className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: TRACK_COLORS[event.track as keyof typeof TRACK_COLORS] }}
                        >
                          {event.track}
                        </span>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveEvent(event.id)}
                            className={`p-2 rounded-full min-w-[44px] min-h-[44px] ${
                              savedEvents.has(event.id) 
                                ? 'text-lume-warm hover:text-lume-warm/80' 
                                : 'text-lume-mist hover:text-lume-light'
                            }`}
                            aria-label={savedEvents.has(event.id) ? 'Remove from saved events' : 'Save event'}
                          >
                            <Star className={`w-5 h-5 ${savedEvents.has(event.id) ? 'fill-current' : ''}`} />
                          </Button>
                        )}
                      </div>
                      <h4 className="text-lg md:text-xl font-display font-semibold text-white mb-3 leading-tight">
                        {event.title}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-lume-light text-sm">
                      <Clock className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      <span className="font-medium">
                        {formatDate(event.start_time)} • {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-lume-light text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    {event.speakers && event.speakers.length > 0 && (
                      <div className="flex items-center text-lume-light text-sm">
                        <Users className="w-4 h-4 mr-3 text-lume-mist flex-shrink-0" />
                        <span>{event.speakers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-lume-light leading-relaxed mb-4 opacity-80 text-sm">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" className="flex-1 min-h-[44px]">
                      View Details
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 min-h-[44px]">
                      Add to Calendar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};