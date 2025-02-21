/*
  # Initial Schema Setup

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `contact_email` (text, not null)
      - `updated_at` (timestamp with time zone)
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `message` (text, not null)
      - `division` (text, not null)
      - `created_at` (timestamp with time zone)
      - `is_read` (boolean)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Settings table
-- CREATE TABLE settings (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   contact_email text NOT NULL,
--   updated_at timestamptz DEFAULT now()
-- );

-- ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow authenticated users to read settings"
--   ON settings
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Allow authenticated users to update settings"
--   ON settings
--   FOR UPDATE
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);

-- Contact messages table
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  division text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public to insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Remove the default settings insert