-- Emergency Requests Table
-- Run this in Supabase SQL Editor
-- This table stores emergency help requests from students

-- Ensure profiles table has role column (required for admin policies)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS emergency_requests_user_id_idx ON public.emergency_requests(user_id);
CREATE INDEX IF NOT EXISTS emergency_requests_status_idx ON public.emergency_requests(status);
CREATE INDEX IF NOT EXISTS emergency_requests_created_at_idx ON public.emergency_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS emergency_requests_location_idx ON public.emergency_requests(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

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

