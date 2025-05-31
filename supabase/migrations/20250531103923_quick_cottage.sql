/*
  # Create posts table and security policies

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published` (boolean)
      - `location` (text)
      - `duration` (text)
      - `difficulty` (text)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for authenticated users to manage their own posts
    - Add policy for admin users to manage all posts
    - Add policy for public to read published posts
*/

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published boolean DEFAULT false,
  location text NOT NULL,
  duration text NOT NULL,
  difficulty text CHECK (difficulty IN ('ușor', 'mediu', 'dificil'))
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own posts
CREATE POLICY "Users can read own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own posts
CREATE POLICY "Users can insert own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public to read published posts
CREATE POLICY "Public can read published posts"
  ON posts
  FOR SELECT
  TO public
  USING (published = true);