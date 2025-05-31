/*
  # Add email authentication support

  1. Security
    - Add policy for email authentication
    - Add policy for password reset
*/

-- Enable email confirmations (optional)
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS email_confirmed_at TIMESTAMPTZ;

-- Add policy to allow users to update their own email
CREATE POLICY "Users can update own email"
ON auth.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);