-- ============================================================================
-- Check Email Verification Status
-- ============================================================================
-- This script helps you check and fix email verification issues
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Check which users have verified emails
-- This shows users from auth.users with their verification status
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as verification_status,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 2. Check specific user's verification status
-- Replace 'your-email@example.com' with the email you want to check
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
WHERE u.email = 'your-email@example.com';

-- 3. Verify a specific user's email (run this to verify an email)
-- Replace 'your-email@example.com' with the email you want to verify
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com'
RETURNING id, email, email_confirmed_at;

-- 4. Verify ALL users' emails (use with caution!)
-- This will verify all unverified emails
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;

-- 5. Verify specific users by email list
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email IN (
  'minusmyself@gmail.com',
  'rshsystem@gmail.com',
  'darnaylakarl@gmail.com',
  'test@example.com',
  'kimyzie8@gmail.com',
  'j4yk1nz@gmail.com'
)
AND email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;

-- 6. Create a view to easily check verification status
-- This creates a view that combines profiles and auth.users
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

-- 7. Query the view (easier way to check verification)
SELECT * FROM public.user_verification_status
ORDER BY user_created_at DESC;

-- ============================================================================
-- Quick Fix: Verify All Existing Users
-- ============================================================================
-- Run this to verify all existing users so they can login
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Check result
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as status
FROM auth.users
ORDER BY created_at DESC;
