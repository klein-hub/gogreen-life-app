/*
  # Carbon Footprint Tracking Schema

  1. New Tables
    - `carbon_footprints`
      - Core data:
        - `id` (uuid, primary key)
        - `user_id` (uuid, references auth.users)
        - `created_at` (timestamptz)
        - `updated_at` (timestamptz)
      
      - Utilities:
        - `electricity` (text)
        - `lpg` (text)
        - `coal` (text)
      
      - Food & Lifestyle:
        - `pharmaceuticals` (text)
        - `clothes_textiles_shoes` (text)
        - `furniture_other_goods` (text)
        - `food_and_drink` (text)
      
      - Technology & Entertainment:
        - `computers_it_equipment` (text)
        - `tv_radio_phone_equipment` (text)
        - `recreational_cultural_sports` (text)
      
      - Services:
        - `hotels_restaurants_pubs` (text)
        - `telecoms` (text)
      
      - Complex Data:
        - `commute` (jsonb) - Array of commute routes
        - `vehicles` (jsonb) - Array of vehicle activities
        - `other` (jsonb) - Array of other activities

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own carbon footprint data
      - Create/update their own carbon footprint data
*/

-- Create carbon_footprints table
CREATE TABLE IF NOT EXISTS carbon_footprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  
  -- Utilities
  electricity text DEFAULT '0',
  lpg text DEFAULT '0',
  coal text DEFAULT '0',
  
  -- Food & Lifestyle
  pharmaceuticals text DEFAULT '0',
  clothes_textiles_shoes text DEFAULT '0',
  furniture_other_goods text DEFAULT '0',
  food_and_drink text DEFAULT '0',
  
  -- Technology & Entertainment
  computers_it_equipment text DEFAULT '0',
  tv_radio_phone_equipment text DEFAULT '0',
  recreational_cultural_sports text DEFAULT '0',
  
  -- Services
  hotels_restaurants_pubs text DEFAULT '0',
  telecoms text DEFAULT '0',
  
  -- Complex Data
  commute jsonb DEFAULT '[]'::jsonb,
  vehicles jsonb DEFAULT '[]'::jsonb,
  other jsonb DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE carbon_footprints ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own carbon footprint"
  ON carbon_footprints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carbon footprint"
  ON carbon_footprints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carbon footprint"
  ON carbon_footprints
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_carbon_footprints_updated_at
  BEFORE UPDATE
  ON carbon_footprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS carbon_footprints_user_id_idx ON carbon_footprints(user_id);