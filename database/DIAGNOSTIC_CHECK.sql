-- ============================================================================
-- DIAGNOSTIC CHECK - Check What's Actually in Your Database
-- ============================================================================
-- Run this to see what users and profiles exist in THIS Supabase project
-- ============================================================================

-- CHECK 1: Do users exist in auth.users?
SELECT 
  'CHECK 1: Users in auth.users' as check_name,
  COUNT(*) as count
FROM auth.users;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data->>'full_name' as name_from_metadata
FROM auth.users
ORDER BY created_at DESC;

-- CHECK 2: Do profiles exist?
SELECT 
  'CHECK 2: Profiles in public.profiles' as check_name,
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

-- CHECK 3: Users WITHOUT profiles (these need profiles created)
SELECT 
  'CHECK 3: Users WITHOUT profiles' as check_name,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

SELECT 
  u.id,
  u.email,
  u.created_at,
  '❌ No profile' as status
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ORDER BY u.created_at DESC;

-- CHECK 4: Is the trigger set up?
SELECT 
  'CHECK 4: Trigger exists?' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ YES - Trigger exists'
    ELSE '❌ NO - Trigger missing! Run complete_setup.sql'
  END as status
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- CHECK 5: Is the trigger function set up?
SELECT 
  'CHECK 5: Trigger function exists?' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ YES - Function exists'
    ELSE '❌ NO - Function missing! Run complete_setup.sql'
  END as status
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Look at the results above:
--
-- If CHECK 1 shows 0 users:
--   → You need to create users first!
--   → Go to: Auth > Users > Add User
--
-- If CHECK 1 shows users but CHECK 2 shows 0 profiles:
--   → Run: FIX_EMPTY_PROFILES.sql to create profiles
--
-- If CHECK 4 or CHECK 5 shows "NO":
--   → Run: complete_setup.sql to set up triggers
-- ============================================================================



