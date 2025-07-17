import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface SubscriptionOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  requireAuth?: boolean;
}

export function useSupabaseSubscription(options: SubscriptionOptions) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const { 
    table, 
    filter, 
    onInsert, 
    onUpdate, 
    onDelete, 
    requireAuth = true 
  } = options;

  const cleanup = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Don't subscribe if authentication is required but user is not authenticated
    if (requireAuth && !user) {
      cleanup();
      return;
    }

    // Create subscription
    const channelName = filter ? `${table}:${filter}` : table;
    const channel = supabase.channel(channelName);

    // Configure postgres changes listener
    const config: any = {
      event: '*',
      schema: 'public',
      table
    };

    if (filter) {
      config.filter = filter;
    }

    channel.on('postgres_changes', config, (payload) => {
      switch (payload.eventType) {
        case 'INSERT':
          onInsert?.(payload);
          break;
        case 'UPDATE':
          onUpdate?.(payload);
          break;
        case 'DELETE':
          onDelete?.(payload);
          break;
      }
    });

    // Subscribe and store reference
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to ${table} changes`);
      }
    });

    subscriptionRef.current = channel;

    // Cleanup on unmount or dependency change
    return cleanup;
  }, [table, filter, onInsert, onUpdate, onDelete, user, requireAuth, cleanup]);

  // Manual cleanup function
  const unsubscribe = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { unsubscribe };
}

// Specialized hook for table subscriptions with common patterns
export function useTableSubscription<T>(
  table: string,
  onDataChange: (type: 'INSERT' | 'UPDATE' | 'DELETE', data: T) => void,
  options: { filter?: string; requireAuth?: boolean } = {}
) {
  return useSupabaseSubscription({
    table,
    filter: options.filter,
    requireAuth: options.requireAuth,
    onInsert: (payload) => onDataChange('INSERT', payload.new),
    onUpdate: (payload) => onDataChange('UPDATE', payload.new),
    onDelete: (payload) => onDataChange('DELETE', payload.old)
  });
}

// Hook for managing a list of items with real-time updates
export function useRealtimeList<T extends { id: string }>(
  table: string,
  initialData: T[] = [],
  options: { filter?: string; requireAuth?: boolean } = {}
) {
  const [items, setItems] = useState<T[]>(initialData);

  const handleDataChange = useCallback((type: 'INSERT' | 'UPDATE' | 'DELETE', data: T) => {
    setItems(prev => {
      switch (type) {
        case 'INSERT':
          return [data, ...prev];
        case 'UPDATE':
          return prev.map(item => item.id === data.id ? data : item);
        case 'DELETE':
          return prev.filter(item => item.id !== data.id);
        default:
          return prev;
      }
    });
  }, []);

  useTableSubscription(table, handleDataChange, options);

  const updateItems = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  return { items, updateItems };
}