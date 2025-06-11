export interface Event {
  id: string;
  title: string;
  time: string;
  track: string;
  location: string;
  description: string;
  speakers: string[];
}

export interface Pitch {
  id: string;
  title: string;
  description: string;
  contact: string;
  timestamp: Date;
  author: string;
}

export interface Gathering {
  id: string;
  name: string;
  location: string;
  time: string;
  description: string;
  timestamp: Date;
  organizer: string;
}

export interface Lesson {
  title: string;
  content: string;
}

export type TrackFilter = 'All' | 'Tech & Innovation' | 'Funding & Investment' | 'Growth & Marketing' | 'Social Impact';