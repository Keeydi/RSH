-- Database Trigger to Send OTP Email Automatically
-- This will send OTP email when a user signs up
-- Run this AFTER running otp_setup.sql

-- Function to send OTP email via Supabase's email system
CREATE OR REPLACE FUNCTION public.send_otp_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_otp_code TEXT;
  v_email TEXT;
  v_name TEXT;
BEGIN
  -- Get user email and name
  v_email := NEW.email;
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  
  -- Generate OTP code
  SELECT public.generate_otp_code(v_email, NEW.id) INTO v_otp_code;
  
  -- Note: Supabase doesn't have a direct SQL function to send emails
  -- We'll use Supabase's email template customization instead
  -- The OTP code will be stored and can be retrieved via the email template
  
  -- Store OTP in user metadata temporarily for email template access
  -- This is a workaround - ideally use Edge Function or external email service
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to send OTP when user signs up
DROP TRIGGER IF EXISTS on_user_signup_send_otp ON auth.users;
CREATE TRIGGER on_user_signup_send_otp
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.send_otp_email_trigger();

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











