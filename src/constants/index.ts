// Application constants
export const APP_CONFIG = {
  name: 'LUME',
  tagline: 'Where diverse minds converge into brilliance',
  description: 'Your intelligent companion for Vancouver Startup Week',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  loading: 800,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const HAPTIC_PATTERNS = {
  light: [25],
  medium: [50],
  heavy: [100],
  success: [50, 50, 50],
  error: [100, 50, 100],
  notification: [25, 25, 25, 25, 25],
} as const;

export const TOAST_DEFAULTS = {
  duration: 4000,
  autoClose: true,
} as const;

export const NETWORKING_SIGNAL_TYPES = [
  { value: 'coffee', label: 'Coffee Chat', color: 'from-lume-warm to-lume-spark' },
  { value: 'lunch', label: 'Lunch Meeting', color: 'from-lume-soft to-lume-glow' },
  { value: 'cowork', label: 'Co-working', color: 'from-lume-glow to-lume-soft' },
  { value: 'walk', label: 'Walking Meeting', color: 'from-lume-spark to-lume-warm' },
  { value: 'chat', label: 'Quick Chat', color: 'from-lume-glow to-lume-warm' },
] as const;

export const TRACK_COLORS = {
  'Tech & Innovation': 'var(--lume-glow)',
  'Funding & Investment': 'var(--lume-soft)',
  'Growth & Marketing': 'var(--lume-warm)',
  'Social Impact': 'var(--lume-spark)',
} as const;

export const PITCH_STAGES = [
  { value: 'idea', label: 'Idea' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'mvp', label: 'MVP' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale' },
] as const;