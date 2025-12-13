-- OTP Codes Table for Email Verification
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS otp_codes_email_idx ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS otp_codes_code_idx ON public.otp_codes(code);
CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx ON public.otp_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read their own OTP codes (for verification)
CREATE POLICY "Users can read their own OTP codes"
  ON public.otp_codes
  FOR SELECT
  USING (email = auth.jwt() ->> 'email' OR user_id = auth.uid());

-- Policy: Allow service role to insert OTP codes (via Edge Function)
-- Note: This requires service role key, so we'll use a function instead

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

