-- ============================================================================
-- Verify All User Emails - Quick Fix for Login Issues
-- ============================================================================
-- This script verifies all existing users' emails so they can login
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Check current verification status
-- This shows all users and their verification status
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as verification_status,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Step 2: Verify ALL existing users' emails
-- This will allow all users to login without email confirmation
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Step 3: Verify result - check that all emails are now verified
SELECT 
  u.email,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as verification_status,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================================================
-- Alternative: Verify Specific Users Only
-- ============================================================================
-- If you only want to verify specific emails, use this instead:

-- UPDATE auth.users 
-- SET email_confirmed_at = NOW()
-- WHERE email IN (
--   'minusmyself@gmail.com',
--   'rshsystem@gmail.com',
--   'darnaylakarl@gmail.com',
--   'test@example.com',
--   'kimyzie8@gmail.com',
--   'j4yk1nz@gmail.com'
-- )
-- AND email_confirmed_at IS NULL;

-- ============================================================================
-- Create a View to Easily Check Verification Status
-- ============================================================================
-- This creates a view that combines profiles and auth.users for easy checking

CREATE OR REPLACE VIEW public.user_verification_status AS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at as user_created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN true
    ELSE false
  END as is_verified,
  p.full_name,
  p.role,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- Query the view to see all users with verification status
SELECT * FROM public.user_verification_status
ORDER BY user_created_at DESC;
