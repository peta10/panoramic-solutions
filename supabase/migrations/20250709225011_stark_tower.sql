/*
  # Fix contact submissions RLS policy for anonymous users

  1. Security Changes
    - Drop existing INSERT policy that's not working correctly
    - Create new policy allowing anonymous users to insert contact submissions
    - Ensure the policy uses the correct 'anon' role instead of 'public'

  2. Changes Made
    - Removed old "Anyone can submit contact forms" policy
    - Added new "Allow anonymous contact submissions" policy for anon role
    - Policy allows INSERT operations without authentication requirements
*/

-- Drop the existing policy that's not working correctly
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;

-- Create a new policy that allows anonymous users to insert contact submissions
CREATE POLICY "Allow anonymous contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert (in case someone is logged in)
CREATE POLICY "Allow authenticated contact submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);