-- OTP Sessions Table Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Create the otp_sessions table
CREATE TABLE IF NOT EXISTS otp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  created_at_ms BIGINT NOT NULL,
  expires_at_ms BIGINT NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_otp_sessions_email 
  ON otp_sessions(email);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_expires_at 
  ON otp_sessions(expires_at_ms);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_used 
  ON otp_sessions(used);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_email_used 
  ON otp_sessions(email, used);

-- Enable Row Level Security
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can verify their own OTP" ON otp_sessions;
DROP POLICY IF EXISTS "Service role can manage all OTP sessions" ON otp_sessions;
DROP POLICY IF EXISTS "Authenticated users can read OTP" ON otp_sessions;

-- Create RLS policies

-- 1. Allow anyone to read OTP sessions (needed for verification)
CREATE POLICY "Anyone can read OTP sessions for verification" ON otp_sessions
  FOR SELECT 
  USING (true);

-- 2. Service role can manage all OTP sessions
CREATE POLICY "Service role can manage OTP sessions" ON otp_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Verify setup
SELECT 
  'otp_sessions' as table_name,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'otp_sessions'
  ) as table_exists;

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'otp_sessions'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'otp_sessions';
