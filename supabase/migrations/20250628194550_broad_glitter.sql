/*
  # Fix Events Table Public Access

  1. Security Changes
    - Update RLS policy on `events` table to allow both `public` and `anon` roles
    - This enables unauthenticated users to view the event schedule
    - Maintains security while allowing public access to events

  2. Changes Made
    - Drop existing restrictive policy
    - Create new policy allowing both authenticated and anonymous users to view events
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can view events" ON events;

-- Create a new policy that allows both authenticated and anonymous users to view events
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO public, anon
  USING (true);