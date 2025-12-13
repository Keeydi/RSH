-- ============================================================================
-- FIX EMPTY PROFILES - Quick Fix Script
-- ============================================================================
-- If your profiles table is empty, run this script!
-- It will create profiles for ALL existing users in auth.users
-- ============================================================================

-- Step 1: Create profiles for ALL existing users
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

-- Step 2: Update test accounts with proper names and roles
UPDATE public.profiles 
SET full_name = 'Test Student', role = 'student'
WHERE email = 'student@test.com';

UPDATE public.profiles 
SET full_name = 'Test Teacher', role = 'teacher'
WHERE email = 'teacher@test.com';

UPDATE public.profiles 
SET full_name = 'Test Admin', role = 'admin'
WHERE email = 'admin@test.com';

UPDATE public.profiles 
SET full_name = 'Test User', role = 'student'
WHERE email = 'test@example.com';

-- Step 3: Show all profiles (verify it worked!)
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ============================================================================
-- DONE! Check the results above.
-- If you see profiles, refresh your Supabase Table Editor.
-- ============================================================================

