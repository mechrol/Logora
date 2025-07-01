/*
  # Initial Schema for Democratic Social Platform

  1. New Tables
    - `profiles` - User profiles with democratic participation data
    - `posts` - Social posts with poll capabilities
    - `post_votes` - Voting system for posts
    - `poll_votes` - Specific votes on poll options
    - `comments` - Comments on posts
    - `communities` - Thematic communities
    - `community_members` - Community membership
    - `projects` - Democratic projects with scientific framework
    - `project_votes` - Voting on projects
    - `affiliate_links` - Monetization through affiliate marketing
    - `analytics_events` - Track user engagement

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - Democratic voting system
    - Scientific framework for projects
    - Community-based organization
    - Gamification with points system
    - Analytics and monetization support
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  username text UNIQUE,
  bio text,
  location text,
  avatar_url text,
  points integer DEFAULT 0,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts table with poll support
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'poll', 'project')),
  poll_data jsonb,
  community_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vote_type text CHECK (vote_type IN ('up', 'down')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Poll votes table (separate from post votes)
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  theme text,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public boolean DEFAULT true,
  member_count integer DEFAULT 0,
  avatar_url text,
  banner_url text,
  rules jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community members table
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Projects table with scientific framework
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  category text DEFAULT 'proposal' CHECK (category IN ('proposal', 'research', 'implementation', 'policy')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'rejected', 'implemented')),
  
  -- Scientific framework fields
  assumption text,
  theorem text,
  proof text,
  conclusion text,
  
  -- Voting and engagement
  vote_score integer DEFAULT 0,
  support_threshold integer DEFAULT 10,
  
  -- Metadata
  tags text[],
  attachments jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project votes table
CREATE TABLE IF NOT EXISTS project_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vote_type text CHECK (vote_type IN ('up', 'down', 'support', 'oppose')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Affiliate links table for monetization
CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  affiliate_code text,
  click_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for posts community_id
ALTER TABLE posts ADD CONSTRAINT posts_community_id_fkey 
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Post votes policies
CREATE POLICY "Post votes are viewable by everyone" ON post_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on posts" ON post_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON post_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON post_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Poll votes policies
CREATE POLICY "Poll votes are viewable by everyone" ON poll_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on polls" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Communities policies
CREATE POLICY "Public communities are viewable by everyone" ON communities
  FOR SELECT USING (is_public = true OR auth.uid() IN (
    SELECT user_id FROM community_members WHERE community_id = communities.id
  ));

CREATE POLICY "Authenticated users can create communities" ON communities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Community creators and admins can update communities" ON communities
  FOR UPDATE USING (
    auth.uid() = creator_id OR 
    auth.uid() IN (
      SELECT user_id FROM community_members 
      WHERE community_id = communities.id AND role = 'admin'
    )
  );

-- Community members policies
CREATE POLICY "Community members are viewable by community members" ON community_members
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM community_members cm 
      WHERE cm.community_id = community_members.community_id
    )
  );

CREATE POLICY "Users can join communities" ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities" ON community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = author_id);

-- Project votes policies
CREATE POLICY "Project votes are viewable by everyone" ON project_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on projects" ON project_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project votes" ON project_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own project votes" ON project_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Affiliate links policies
CREATE POLICY "Affiliate links are viewable by everyone" ON affiliate_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create own affiliate links" ON affiliate_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate links" ON affiliate_links
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can insert their own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Functions and Triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities 
    SET member_count = member_count - 1 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for community member count
CREATE TRIGGER community_member_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Function to update project vote score
CREATE OR REPLACE FUNCTION update_project_vote_score()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET vote_score = vote_score + CASE 
      WHEN NEW.vote_type IN ('up', 'support') THEN 1 
      ELSE -1 
    END
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET vote_score = vote_score - CASE 
      WHEN OLD.vote_type IN ('up', 'support') THEN 1 
      ELSE -1 
    END
    WHERE id = OLD.project_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE projects 
    SET vote_score = vote_score 
      - CASE WHEN OLD.vote_type IN ('up', 'support') THEN 1 ELSE -1 END
      + CASE WHEN NEW.vote_type IN ('up', 'support') THEN 1 ELSE -1 END
    WHERE id = NEW.project_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project vote score
CREATE TRIGGER project_vote_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_votes
  FOR EACH ROW EXECUTE FUNCTION update_project_vote_score();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_author_id ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_community_id ON projects(community_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_votes_project_id ON project_votes(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);