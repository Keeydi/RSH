-- ============================================================================
-- Check and Fix Profiles - Diagnostic and Fix Script
-- ============================================================================
-- This script will:
-- 1. Check if users exist in auth.users
-- 2. Check if profiles exist
-- 3. Create missing profiles
-- 4. Set roles for test accounts
-- ============================================================================

-- STEP 1: Check existing users
SELECT 
  'Users in auth.users:' as info,
  COUNT(*) as count
FROM auth.users;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Check existing profiles
SELECT 
  'Profiles in public.profiles:' as info,
  COUNT(*) as count
FROM public.profiles;

SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- STEP 3: Find users without profiles
SELECT 
  'Users WITHOUT profiles:' as info,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- STEP 4: Create profiles for users that don't have them
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1)
  ) as full_name,
  u.email,
  'student' as role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- STEP 5: Update test account roles and names
UPDATE public.profiles 
SET 
  full_name = 'Test Student',
  role = 'student'
WHERE email = 'student@test.com';

UPDATE public.profiles 
SET 
  full_name = 'Test Teacher',
  role = 'teacher'
WHERE email = 'teacher@test.com';

UPDATE public.profiles 
SET 
  full_name = 'Test Admin',
  role = 'admin'
WHERE email = 'admin@test.com';

UPDATE public.profiles 
SET 
  full_name = 'Test User',
  role = 'student'
WHERE email = 'test@example.com';

-- STEP 6: Final verification
SELECT 
  'FINAL RESULT - All Profiles:' as info
UNION ALL
SELECT 
  'Total profiles: ' || COUNT(*)::text
FROM public.profiles;

SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ User exists'
    ELSE '❌ User missing'
  END as user_status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- ============================================================================
-- If profiles are still empty after running this:
-- ============================================================================
-- 1. Make sure you've created users in Supabase Auth Dashboard
-- 2. Check that the trigger is set up (run complete_setup.sql if needed)
-- 3. Verify the profiles table exists and has the correct structure
-- ============================================================================


