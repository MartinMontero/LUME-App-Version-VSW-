/*
  # Add Networking and Real-time Features

  1. New Tables
    - `networking_signals` - Real-time availability broadcasts
    - `networking_responses` - Responses to networking signals
    - `user_locations` - Optional location sharing for spontaneous meetups

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user data access

  3. Functions
    - Add function to find nearby users based on location
*/

-- Networking signals for real-time availability
CREATE TABLE IF NOT EXISTS networking_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('coffee', 'lunch', 'cowork', 'walk', 'chat')),
  message text NOT NULL,
  location text,
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Responses to networking signals
CREATE TABLE IF NOT EXISTS networking_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  signal_id uuid REFERENCES networking_signals(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, signal_id)
);

-- User locations for proximity-based networking
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  venue text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE networking_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Networking signals policies
CREATE POLICY "Anyone can view active signals"
  ON networking_signals FOR SELECT
  TO authenticated
  USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can create signals"
  ON networking_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON networking_signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own signals"
  ON networking_signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Networking responses policies
CREATE POLICY "Users can view responses to their signals"
  ON networking_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networking_signals 
      WHERE id = signal_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses"
  ON networking_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own responses"
  ON networking_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User locations policies
CREATE POLICY "Users can view nearby locations"
  ON user_locations FOR SELECT
  TO authenticated
  USING (updated_at > now() - interval '1 hour');

CREATE POLICY "Users can manage own location"
  ON user_locations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to find nearby users
CREATE OR REPLACE FUNCTION get_nearby_users(
  user_lat decimal,
  user_lng decimal,
  radius_km decimal DEFAULT 1
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  company text,
  venue text,
  distance_km decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ul.user_id,
    p.full_name,
    p.company,
    ul.venue,
    ROUND(
      (6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(ul.latitude)) * 
        cos(radians(ul.longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(ul.latitude))
      ))::decimal, 2
    ) as distance_km
  FROM user_locations ul
  JOIN profiles p ON ul.user_id = p.id
  WHERE ul.updated_at > now() - interval '1 hour'
    AND ul.user_id != auth.uid()
    AND (6371 * acos(
      cos(radians(user_lat)) * 
      cos(radians(ul.latitude)) * 
      cos(radians(ul.longitude) - radians(user_lng)) + 
      sin(radians(user_lat)) * 
      sin(radians(ul.latitude))
    )) <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_networking_signals_active ON networking_signals(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_networking_signals_user_id ON networking_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_networking_responses_signal_id ON networking_responses(signal_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_updated_at ON user_locations(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_locations_coords ON user_locations(latitude, longitude);

-- Function to automatically deactivate expired signals
CREATE OR REPLACE FUNCTION deactivate_expired_signals()
RETURNS void AS $$
BEGIN
  UPDATE networking_signals 
  SET is_active = false 
  WHERE is_active = true AND expires_at <= now();
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to clean up expired signals periodically
-- Note: In production, you'd want to run this via a cron job or scheduled function