import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Events helpers
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true });
  return { data, error };
};

export const saveEvent = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from('event_saves')
    .insert({ user_id: userId, event_id: eventId })
    .select()
    .single();
  return { data, error };
};

export const unsaveEvent = async (userId: string, eventId: string) => {
  const { error } = await supabase
    .from('event_saves')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  return { error };
};

export const getSavedEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from('event_saves')
    .select('event_id')
    .eq('user_id', userId);
  return { data, error };
};

// Pitches helpers
export const getPitches = async () => {
  const { data, error } = await supabase
    .from('pitches')
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createPitch = async (pitchData: any) => {
  const { data, error } = await supabase
    .from('pitches')
    .insert(pitchData)
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .single();
  return { data, error };
};

export const likePitch = async (userId: string, pitchId: string) => {
  const { data, error } = await supabase
    .from('pitch_interactions')
    .insert({
      user_id: userId,
      pitch_id: pitchId,
      interaction_type: 'like'
    })
    .select()
    .single();
  return { data, error };
};

export const unlikePitch = async (userId: string, pitchId: string) => {
  const { error } = await supabase
    .from('pitch_interactions')
    .delete()
    .eq('user_id', userId)
    .eq('pitch_id', pitchId)
    .eq('interaction_type', 'like');
  return { error };
};

// Gatherings helpers
export const getGatherings = async () => {
  const { data, error } = await supabase
    .from('gatherings')
    .select(`
      *,
      profiles:organizer_id (
        full_name,
        company
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createGathering = async (gatheringData: any) => {
  const { data, error } = await supabase
    .from('gatherings')
    .insert(gatheringData)
    .select(`
      *,
      profiles:organizer_id (
        full_name,
        company
      )
    `)
    .single();
  return { data, error };
};

export const joinGathering = async (userId: string, gatheringId: string) => {
  const { data, error } = await supabase
    .from('gathering_attendees')
    .insert({
      user_id: userId,
      gathering_id: gatheringId,
      status: 'attending'
    })
    .select()
    .single();
  return { data, error };
};

export const leaveGathering = async (userId: string, gatheringId: string) => {
  const { error } = await supabase
    .from('gathering_attendees')
    .delete()
    .eq('user_id', userId)
    .eq('gathering_id', gatheringId);
  return { error };
};

// Networking Signals helpers
export const getNetworkingSignals = async () => {
  const { data, error } = await supabase
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
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createNetworkingSignal = async (signalData: any) => {
  const { data, error } = await supabase
    .from('networking_signals')
    .insert(signalData)
    .select(`
      *,
      profiles:user_id (
        full_name,
        company
      )
    `)
    .single();
  return { data, error };
};

export const respondToSignal = async (userId: string, signalId: string, message: string) => {
  const { data, error } = await supabase
    .from('networking_responses')
    .insert({
      user_id: userId,
      signal_id: signalId,
      message: message
    })
    .select()
    .single();
  return { data, error };
};

export const updateUserLocation = async (userId: string, latitude: number, longitude: number, venue?: string) => {
  const { data, error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
      venue: venue,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  return { data, error };
};

export const getNearbyUsers = async (latitude: number, longitude: number, radiusKm: number = 1) => {
  const { data, error } = await supabase
    .rpc('get_nearby_users', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm
    });
  return { data, error };
};

// Real-time subscriptions
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
};