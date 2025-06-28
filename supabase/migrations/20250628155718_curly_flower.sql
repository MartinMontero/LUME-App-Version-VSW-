/*
  # Fix Public Data Access

  1. Changes
    - Update RLS policies for events, pitches, and gatherings tables
    - Allow unauthenticated users to view public data
    - Maintain security for write operations

  2. Security
    - Keep RLS enabled on all tables
    - Allow public read access for events, pitches, and gatherings
    - Maintain authenticated-only access for write operations
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view pitches" ON pitches;
DROP POLICY IF EXISTS "Anyone can view gatherings" ON gatherings;

-- Create new public read policies
CREATE POLICY "Public can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Public can view pitches"
  ON pitches FOR SELECT
  USING (true);

CREATE POLICY "Public can view gatherings"
  ON gatherings FOR SELECT
  USING (true);

-- Keep existing authenticated-only write policies for pitches
-- (These remain unchanged as they should still require authentication)

-- Keep existing authenticated-only write policies for gatherings
-- (These remain unchanged as they should still require authentication)