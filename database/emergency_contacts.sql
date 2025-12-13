-- Emergency Contacts Table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS emergency_contacts_user_id_idx ON public.emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS emergency_contacts_primary_idx ON public.emergency_contacts(user_id, is_primary);

-- Enable Row Level Security
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

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

