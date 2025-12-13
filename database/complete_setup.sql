-- ============================================================================
-- RHS ArchAID - Complete Database Setup
-- ============================================================================
-- This file contains ALL database setup scripts in the correct order
-- Run this ONCE in Supabase SQL Editor to set up your entire database
-- 
-- Location: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new
-- ============================================================================

-- ============================================================================
-- PART 1: EXTENSIONS
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 2: PROFILES TABLE
-- ============================================================================

-- Create profiles table for additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add role column (required for admin policies)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- ============================================================================
-- PART 3: EMERGENCY CONTACTS TABLE
-- ============================================================================

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS emergency_contacts_user_id_idx ON public.emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS emergency_contacts_primary_idx ON public.emergency_contacts(user_id, is_primary);

-- Enable Row Level Security
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can insert own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can update own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can delete own emergency contacts" ON public.emergency_contacts;

-- Policy: Users can view their own emergency contacts
CREATE POLICY "Users can view own emergency contacts"
  ON public.emergency_contacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own emergency contacts
CREATE POLICY "Users can insert own emergency contacts"
  ON public.emergency_contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own emergency contacts
CREATE POLICY "Users can update own emergency contacts"
  ON public.emergency_contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own emergency contacts
CREATE POLICY "Users can delete own emergency contacts"
  ON public.emergency_contacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_emergency_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON public.emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_emergency_contact_updated_at();

-- Function to ensure only one primary contact per user
CREATE OR REPLACE FUNCTION public.ensure_single_primary_contact()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = TRUE THEN
    -- Unset other primary contacts for this user
    UPDATE public.emergency_contacts
    SET is_primary = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_primary = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to ensure only one primary contact
DROP TRIGGER IF EXISTS ensure_single_primary_contact_trigger ON public.emergency_contacts;
CREATE TRIGGER ensure_single_primary_contact_trigger
  BEFORE INSERT OR UPDATE ON public.emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_primary_contact();

-- ============================================================================
-- PART 4: EMERGENCY REQUESTS TABLE
-- ============================================================================

-- Create emergency_requests table
CREATE TABLE IF NOT EXISTS public.emergency_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  user_email TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'responded', 'resolved', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  responder_id UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS emergency_requests_user_id_idx ON public.emergency_requests(user_id);
CREATE INDEX IF NOT EXISTS emergency_requests_status_idx ON public.emergency_requests(status);
CREATE INDEX IF NOT EXISTS emergency_requests_created_at_idx ON public.emergency_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS emergency_requests_location_idx ON public.emergency_requests(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own emergency requests" ON public.emergency_requests;
DROP POLICY IF EXISTS "Users can insert own emergency requests" ON public.emergency_requests;
DROP POLICY IF EXISTS "Admins can view all emergency requests" ON public.emergency_requests;
DROP POLICY IF EXISTS "Admins can update emergency requests" ON public.emergency_requests;

-- Policy: Users can view their own emergency requests
CREATE POLICY "Users can view own emergency requests"
  ON public.emergency_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own emergency requests
CREATE POLICY "Users can insert own emergency requests"
  ON public.emergency_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all emergency requests
CREATE POLICY "Admins can view all emergency requests"
  ON public.emergency_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Admins can update emergency requests
CREATE POLICY "Admins can update emergency requests"
  ON public.emergency_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Function to automatically populate user_name and user_email
CREATE OR REPLACE FUNCTION public.set_emergency_request_user_info()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_name IS NULL OR NEW.user_email IS NULL THEN
    SELECT full_name, email INTO NEW.user_name, NEW.user_email
    FROM public.profiles
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set user info
DROP TRIGGER IF EXISTS set_emergency_request_user_info_trigger ON public.emergency_requests;
CREATE TRIGGER set_emergency_request_user_info_trigger
  BEFORE INSERT ON public.emergency_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_emergency_request_user_info();

-- ============================================================================
-- PART 5: OTP CODES TABLE
-- ============================================================================

-- Create OTP codes table
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS otp_codes_email_idx ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS otp_codes_code_idx ON public.otp_codes(code);
CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx ON public.otp_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own OTP codes" ON public.otp_codes;

-- Policy: Allow users to read their own OTP codes (for verification)
CREATE POLICY "Users can read their own OTP codes"
  ON public.otp_codes
  FOR SELECT
  USING (email = auth.jwt() ->> 'email' OR user_id = auth.uid());

-- Function to generate and store OTP code
CREATE OR REPLACE FUNCTION public.generate_otp_code(
  p_email TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Generate 6-digit random code
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  v_expires_at := NOW() + INTERVAL '10 minutes';
  
  -- Insert OTP code
  INSERT INTO public.otp_codes (email, code, user_id, expires_at)
  VALUES (p_email, v_code, p_user_id, v_expires_at);
  
  -- Clean up old expired codes
  DELETE FROM public.otp_codes 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify OTP code
CREATE OR REPLACE FUNCTION public.verify_otp_code(
  p_email TEXT,
  p_code TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find valid, unused OTP code
  SELECT user_id INTO v_user_id
  FROM public.otp_codes
  WHERE email = p_email
    AND code = p_code
    AND used = FALSE
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If found, mark as used
  IF v_user_id IS NOT NULL THEN
    UPDATE public.otp_codes
    SET used = TRUE
    WHERE email = p_email
      AND code = p_code
      AND used = FALSE
      AND expires_at > NOW();
  END IF;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.generate_otp_code TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_otp_code TO anon, authenticated;

-- Function to get OTP code for an email (for email template)
CREATE OR REPLACE FUNCTION public.get_latest_otp(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  SELECT code INTO v_code
  FROM public.otp_codes
  WHERE email = p_email
    AND used = FALSE
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(v_code, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_latest_otp TO anon, authenticated;

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- All tables, functions, triggers, and policies have been created.
-- 
-- Tables created:
--   ✅ profiles
--   ✅ emergency_contacts
--   ✅ emergency_requests
--   ✅ otp_codes
--
-- Next steps:
--   1. Create a test user via Supabase Dashboard > Auth > Users
--   2. Or use the app's sign-up feature
--   3. See CREATE_TEST_USER.md for instructions
-- ============================================================================


