/*
  # Add Admin Features and System Settings

  1. New Tables
    - `system_settings` - Platform configuration settings
    - `admin_logs` - Track admin actions for audit trail
    - `content_reports` - User reports for content moderation

  2. Updates
    - Add admin-specific fields to existing tables
    - Create admin audit trail system
    - Add content moderation flags

  3. Security
    - Admin-only policies for sensitive operations
    - Audit logging for all admin actions
*/

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  target_type text, -- 'user', 'post', 'community', etc.
  target_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Content reports table
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment', 'user', 'community')),
  content_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add moderation fields to existing tables
DO $$
BEGIN
  -- Add moderation status to posts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'moderation_status'
  ) THEN
    ALTER TABLE posts ADD COLUMN moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged'));
  END IF;

  -- Add moderation status to comments
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comments' AND column_name = 'moderation_status'
  ) THEN
    ALTER TABLE comments ADD COLUMN moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged'));
  END IF;

  -- Add suspension fields to profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_suspended'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_suspended boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspended_until'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspended_until timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspension_reason'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspension_reason text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Only admins can view system settings" ON system_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify system settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for admin_logs
CREATE POLICY "Only admins can view admin logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can create admin logs" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ) AND auth.uid() = admin_id
  );

-- RLS Policies for content_reports
CREATE POLICY "Users can view their own reports" ON content_reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Authenticated users can create reports" ON content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins and moderators can update reports" ON content_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'moderator')
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update system settings
CREATE OR REPLACE FUNCTION update_system_setting(
  p_key text,
  p_value jsonb,
  p_description text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
  VALUES (p_key, p_value, p_description, auth.uid())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    description = COALESCE(EXCLUDED.description, system_settings.description),
    updated_by = EXCLUDED.updated_by,
    updated_at = now();

  -- Log the action
  PERFORM log_admin_action('update_system_setting', 'setting', NULL, 
    jsonb_build_object('key', p_key, 'value', p_value));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('site_name', '"AITribes"', 'The name of the platform'),
  ('site_description', '"Create and nurture vibrant AI communities."', 'Platform description'),
  ('allow_registration', 'true', 'Whether new user registration is allowed'),
  ('require_email_verification', 'false', 'Whether email verification is required'),
  ('enable_notifications', 'true', 'Whether notifications are enabled'),
  ('max_post_length', '2000', 'Maximum characters allowed in a post'),
  ('max_comments_per_post', '100', 'Maximum comments allowed per post'),
  ('voting_enabled', 'true', 'Whether voting is enabled'),
  ('moderation_mode', '"auto"', 'Content moderation mode: auto, manual, or disabled'),
  ('maintenance_mode', 'false', 'Whether the platform is in maintenance mode')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_content_type ON content_reports(content_type);
CREATE INDEX IF NOT EXISTS idx_content_reports_created_at ON content_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- Update existing admin user (if exists) or create one
DO $$
BEGIN
  -- This would typically be done through the application
  -- but we can set a default admin for testing
  UPDATE profiles 
  SET role = 'admin' 
  WHERE id IN (
    SELECT id FROM profiles 
    ORDER BY created_at 
    LIMIT 1
  );
END $$;