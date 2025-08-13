/*
  # Contact Form Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `company` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anyone to insert submissions (for public form)
    - Add policy for admin users to read all submissions
    - Add trigger for automatic updated_at timestamp

  3. Indexes
    - Add index on created_at for efficient querying by date
    - Add index on email for lookup purposes
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin users can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions USING btree (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions USING btree (email);

-- Add trigger for updated_at timestamp
CREATE TRIGGER set_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();