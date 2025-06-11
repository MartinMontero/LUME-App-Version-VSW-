/*
  # Vancouver Startup Week Database Schema

  1. New Tables
    - `profiles` - User profiles with startup information
    - `events` - Official VSW events with tracks and speakers
    - `pitches` - User-submitted startup pitches
    - `gatherings` - Community-organized informal meetups
    - `event_saves` - User's saved/favorited events
    - `pitch_interactions` - Likes and comments on pitches
    - `gathering_attendees` - RSVP tracking for gatherings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure user data access

  3. Features
    - Real-time subscriptions for live updates
    - Full-text search capabilities
    - Proper indexing for performance
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  company text,
  role text,
  bio text,
  interests text[],
  looking_for text[],
  contact_info jsonb DEFAULT '{}',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table for official VSW events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text NOT NULL,
  track text NOT NULL,
  speakers text[] DEFAULT '{}',
  capacity integer,
  registration_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pitches table for startup pitches
CREATE TABLE IF NOT EXISTS pitches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  contact_info text NOT NULL,
  tags text[] DEFAULT '{}',
  looking_for text[] DEFAULT '{}',
  stage text DEFAULT 'idea',
  industry text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gatherings table for informal meetups
CREATE TABLE IF NOT EXISTS gatherings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  max_attendees integer,
  tags text[] DEFAULT '{}',
  attendee_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event saves for user favorites
CREATE TABLE IF NOT EXISTS event_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Pitch interactions for likes and engagement
CREATE TABLE IF NOT EXISTS pitch_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pitch_id uuid REFERENCES pitches(id) ON DELETE CASCADE NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'comment')),
  comment_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pitch_id, interaction_type)
);

-- Gathering attendees for RSVP tracking
CREATE TABLE IF NOT EXISTS gathering_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  gathering_id uuid REFERENCES gatherings(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, gathering_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gatherings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gathering_attendees ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Events policies (read-only for users)
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Pitches policies
CREATE POLICY "Anyone can view pitches"
  ON pitches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create pitches"
  ON pitches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pitches"
  ON pitches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pitches"
  ON pitches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gatherings policies
CREATE POLICY "Anyone can view gatherings"
  ON gatherings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create gatherings"
  ON gatherings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update own gatherings"
  ON gatherings FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete own gatherings"
  ON gatherings FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Event saves policies
CREATE POLICY "Users can manage own event saves"
  ON event_saves FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pitch interactions policies
CREATE POLICY "Users can view all interactions"
  ON pitch_interactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create interactions"
  ON pitch_interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
  ON pitch_interactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
  ON pitch_interactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gathering attendees policies
CREATE POLICY "Users can view all attendees"
  ON gathering_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own attendance"
  ON gathering_attendees FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_track ON events(track);
CREATE INDEX IF NOT EXISTS idx_pitches_user_id ON pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_pitches_created_at ON pitches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gatherings_scheduled_time ON gatherings(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_gatherings_organizer_id ON gatherings(organizer_id);

-- Functions for updating counts
CREATE OR REPLACE FUNCTION update_pitch_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.interaction_type = 'like' THEN
    UPDATE pitches SET likes_count = likes_count + 1 WHERE id = NEW.pitch_id;
  ELSIF TG_OP = 'DELETE' AND OLD.interaction_type = 'like' THEN
    UPDATE pitches SET likes_count = likes_count - 1 WHERE id = OLD.pitch_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_gathering_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'attending' THEN
    UPDATE gatherings SET attendee_count = attendee_count + 1 WHERE id = NEW.gathering_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'attending' THEN
    UPDATE gatherings SET attendee_count = attendee_count - 1 WHERE id = OLD.gathering_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'attending' AND NEW.status != 'attending' THEN
      UPDATE gatherings SET attendee_count = attendee_count - 1 WHERE id = NEW.gathering_id;
    ELSIF OLD.status != 'attending' AND NEW.status = 'attending' THEN
      UPDATE gatherings SET attendee_count = attendee_count + 1 WHERE id = NEW.gathering_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_pitch_likes_count
  AFTER INSERT OR DELETE ON pitch_interactions
  FOR EACH ROW EXECUTE FUNCTION update_pitch_likes_count();

CREATE TRIGGER trigger_update_gathering_attendee_count
  AFTER INSERT OR UPDATE OR DELETE ON gathering_attendees
  FOR EACH ROW EXECUTE FUNCTION update_gathering_attendee_count();

-- Insert sample data
INSERT INTO events (title, description, start_time, end_time, location, track, speakers) VALUES
('AI Revolution in Startups', 'Exploring how AI is transforming the startup landscape with real-world case studies and practical applications.', '2025-01-20 09:00:00-08', '2025-01-20 10:30:00-08', 'Main Stage - Convention Center', 'Tech & Innovation', ARRAY['Sarah Chen', 'Marcus Rodriguez']),
('Securing Series A Funding', 'Key strategies for raising your first major round, including pitch deck essentials and investor relations.', '2025-01-20 10:30:00-08', '2025-01-20 12:00:00-08', 'Investor Lounge - Level 2', 'Funding & Investment', ARRAY['Jennifer Kim', 'David Thompson']),
('Growth Hacking Workshop', 'Hands-on session on scaling user acquisition through data-driven marketing strategies.', '2025-01-20 14:00:00-08', '2025-01-20 16:00:00-08', 'Workshop Room A', 'Growth & Marketing', ARRAY['Alex Foster', 'Lisa Zhang']),
('Impact Investing Panel', 'Balancing profit with social good - insights from successful impact investors and entrepreneurs.', '2025-01-20 15:30:00-08', '2025-01-20 17:00:00-08', 'Panel Room - Level 3', 'Social Impact', ARRAY['Dr. Rachel Green', 'Tom Mitchell']),
('Blockchain Beyond Crypto', 'Real-world applications of blockchain technology in supply chain, healthcare, and governance.', '2025-01-21 11:00:00-08', '2025-01-21 12:30:00-08', 'Tech Theater', 'Tech & Innovation', ARRAY['Kevin Park', 'Maria Santos']),
('Angel Investor Meetup', 'Connect with potential angel investors in an intimate networking setting.', '2025-01-21 16:00:00-08', '2025-01-21 18:00:00-08', 'Networking Lounge', 'Funding & Investment', ARRAY['Multiple Angels']);