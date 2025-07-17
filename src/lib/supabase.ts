import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { apiCall, getCachedData, setCachedData } from './api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for development when Supabase is not configured
const defaultUrl = 'https://example.supabase.co';
const defaultKey = 'example-key';

const finalUrl = supabaseUrl || defaultUrl;
const finalKey = supabaseAnonKey || defaultKey;

// Log warning if using fallback values
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using fallback values.');
}

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const signUp = (email: string, password: string, userData: any) =>
  apiCall(() => supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  }));

export const signIn = (email: string, password: string) =>
  apiCall(() => supabase.auth.signInWithPassword({ email, password }));

export const signOut = () =>
  apiCall(() => supabase.auth.signOut());

export const getCurrentUser = () =>
  apiCall(() => supabase.auth.getUser());

// Profile helpers
export const getProfile = (userId: string) =>
  apiCall(() => supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  );

export const updateProfile = (userId: string, updates: any) =>
  apiCall(() => supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  );

// Events helpers with caching - Events are publicly accessible
export const getEvents = async () => {
  const cacheKey = 'events';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return { data: cached, error: null };
  }
  
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        data: [], 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.warn('Supabase error:', error);
      return { 
        data: [], 
        error: null 
      };
    }
    
    if (data) {
      setCachedData(cacheKey, data, 600000); // 10 minutes cache
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.warn('Network error loading events:', error);
    return { 
      data: [], 
      error: null 
    };
  }
};

export const saveEvent = (userId: string, eventId: string) =>
  apiCall(() => supabase
    .from('event_saves')
    .insert({ user_id: userId, event_id: eventId })
    .select()
    .single()
  );

export const unsaveEvent = (userId: string, eventId: string) =>
  apiCall(() => supabase
    .from('event_saves')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId)
  );

export const getSavedEvents = (userId: string) =>
  apiCall(() => supabase
    .from('event_saves')
    .select('event_id')
    .eq('user_id', userId)
  );

// Pitches helpers
export const getPitches = () =>
  apiCall(() => supabase
    .from('pitches')
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .order('created_at', { ascending: false })
  );

export const createPitch = (pitchData: any) =>
  apiCall(() => supabase
    .from('pitches')
    .insert(pitchData)
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .single()
  );

export const likePitch = (userId: string, pitchId: string) =>
  apiCall(() => supabase
    .from('pitch_interactions')
    .insert({
      user_id: userId,
      pitch_id: pitchId,
      interaction_type: 'like'
    })
    .select()
    .single()
  );

export const unlikePitch = (userId: string, pitchId: string) =>
  apiCall(() => supabase
    .from('pitch_interactions')
    .delete()
    .eq('user_id', userId)
    .eq('pitch_id', pitchId)
    .eq('interaction_type', 'like')
  );

// Gatherings helpers
export const getGatherings = () =>
  apiCall(() => supabase
    .from('gatherings')
    .select(`
      *,
      profiles:organizer_id (
        full_name,
        company
      )
    `)
    .order('created_at', { ascending: false })
  );

export const createGathering = (gatheringData: any) =>
  apiCall(() => supabase
    .from('gatherings')
    .insert(gatheringData)
    .select(`
      *,
      profiles:organizer_id (
        full_name,
        company
      )
    `)
    .single()
  );

export const joinGathering = (userId: string, gatheringId: string) =>
  apiCall(() => supabase
    .from('gathering_attendees')
    .insert({
      user_id: userId,
      gathering_id: gatheringId,
      status: 'attending'
    })
    .select()
    .single()
  );

export const leaveGathering = (userId: string, gatheringId: string) =>
  apiCall(() => supabase
    .from('gathering_attendees')
    .delete()
    .eq('user_id', userId)
    .eq('gathering_id', gatheringId)
  );

// Networking Signals helpers
export const getNetworkingSignals = () =>
  apiCall(() => supabase
    .from('networking_signals')
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  );

export const createNetworkingSignal = (signalData: any) =>
  apiCall(() => supabase
    .from('networking_signals')
    .insert(signalData)
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .single()
  );

export const respondToSignal = (userId: string, signalId: string, message: string) =>
  apiCall(() => supabase
    .from('networking_responses')
    .insert({
      user_id: userId,
      signal_id: signalId,
      message: message
    })
    .select()
    .single()
  );

export const updateUserLocation = (userId: string, latitude: number, longitude: number, venue?: string) =>
  apiCall(() => supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
      venue: venue,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  );

export const getNearbyUsers = (latitude: number, longitude: number, radiusKm: number = 1) =>
  apiCall(() => supabase
    .rpc('get_nearby_users', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm
    })
  );

// Real-time subscriptions
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
};