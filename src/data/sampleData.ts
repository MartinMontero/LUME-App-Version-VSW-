import { Event, Pitch, Gathering, Lesson } from '../types';

export const eventsData: Event[] = [
  {
    id: '1',
    title: 'AI Revolution in Startups',
    time: '9:00 AM',
    track: 'Tech & Innovation',
    location: 'Main Stage',
    description: 'Exploring how AI is transforming the startup landscape',
    speakers: ['Sarah Chen', 'Marcus Rodriguez']
  },
  {
    id: '2',
    title: 'Securing Series A Funding',
    time: '10:30 AM',
    track: 'Funding & Investment',
    location: 'Investor Lounge',
    description: 'Key strategies for raising your first major round',
    speakers: ['Jennifer Kim', 'David Thompson']
  },
  {
    id: '3',
    title: 'Growth Hacking Workshop',
    time: '2:00 PM',
    track: 'Growth & Marketing',
    location: 'Workshop Room A',
    description: 'Hands-on session on scaling user acquisition',
    speakers: ['Alex Foster', 'Lisa Zhang']
  },
  {
    id: '4',
    title: 'Impact Investing Panel',
    time: '3:30 PM',
    track: 'Social Impact',
    location: 'Panel Room',
    description: 'Balancing profit with social good',
    speakers: ['Dr. Rachel Green', 'Tom Mitchell']
  },
  {
    id: '5',
    title: 'Blockchain Beyond Crypto',
    time: '11:00 AM',
    track: 'Tech & Innovation',
    location: 'Tech Theater',
    description: 'Real-world applications of blockchain technology',
    speakers: ['Kevin Park', 'Maria Santos']
  },
  {
    id: '6',
    title: 'Angel Investor Meetup',
    time: '4:00 PM',
    track: 'Funding & Investment',
    location: 'Networking Lounge',
    description: 'Connect with potential angel investors',
    speakers: ['Multiple Angels']
  }
];

export const initialPitchData: Pitch[] = [
  {
    id: '1',
    title: 'EcoTrack - Carbon Footprint App',
    description: 'Revolutionary app helping individuals track and reduce their carbon footprint with AI-powered recommendations.',
    contact: 'sarah@ecotrack.io',
    timestamp: new Date(Date.now() - 3600000),
    author: 'Sarah M.'
  },
  {
    id: '2',
    title: 'MedConnect - Telemedicine Platform',
    description: 'Connecting rural patients with specialists through secure video consultations and AI diagnostics.',
    contact: 'team@medconnect.ca',
    timestamp: new Date(Date.now() - 7200000),
    author: 'Dr. James L.'
  },
  {
    id: '3',
    title: 'FoodShare - Waste Reduction Network',
    description: 'Platform connecting restaurants with excess food to local food banks and shelters.',
    contact: 'hello@foodshare.app',
    timestamp: new Date(Date.now() - 1800000),
    author: 'Maya P.'
  }
];

export const initialGatheringsData: Gathering[] = [
  {
    id: '1',
    name: 'Late Night Startup Stories',
    location: 'Coffee Shop on Robson',
    time: '8:00 PM',
    description: 'Casual meetup to share startup war stories over coffee',
    timestamp: new Date(Date.now() - 5400000),
    organizer: 'Alex R.'
  },
  {
    id: '2',
    name: 'Morning Yoga for Entrepreneurs',
    location: 'English Bay Beach',
    time: '7:00 AM Tomorrow',
    description: 'Start your day with mindfulness and networking',
    timestamp: new Date(Date.now() - 3600000),
    organizer: 'Lisa K.'
  },
  {
    id: '3',
    name: 'Founder\'s Happy Hour',
    location: 'The Keefer Bar',
    time: '6:30 PM',
    description: 'Unwind with fellow founders over craft cocktails',
    timestamp: new Date(Date.now() - 900000),
    organizer: 'Mike D.'
  }
];

export const lessonsData: Lesson[] = [
  {
    title: 'The Network Effect',
    content: 'Every connection made exponentially increases the value for all participants. We\'ve designed features that encourage spontaneous interactions and meaningful connections.'
  },
  {
    title: 'Serendipity by Design',
    content: 'The best opportunities often come from unexpected encounters. Our "Serendipity Multiplier" creates structured spontaneity - organized chaos that leads to breakthrough moments.'
  },
  {
    title: 'Community Over Competition',
    content: 'Startups thrive in collaborative environments. We foster a community-first approach where sharing knowledge and resources benefits everyone.'
  },
  {
    title: 'Real-time Relevance',
    content: 'Startup events are dynamic. Our live features ensure you never miss emerging opportunities or last-minute changes.'
  }
];

export const trackColors = {
  'Tech & Innovation': '#3B82F6',
  'Funding & Investment': '#10B981',
  'Growth & Marketing': '#F59E0B',
  'Social Impact': '#EF4444'
};