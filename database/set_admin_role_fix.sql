-- Fix: Set Admin Role for rhs@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Add role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Step 2: Set rhs@gmail.com as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'rhs@gmail.com';

-- Step 3: If profile doesn't exist, create it
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'admin', 'Admin User'
FROM auth.users
WHERE email = 'rhs@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- Step 4: Verify admin role is set
SELECT 
    u.id,
    u.email,
    p.role,
    p.full_name,
    CASE WHEN p.role = 'admin' THEN '✅ Admin' ELSE '❌ Not Admin' END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'rhs@gmail.com';

-- If role is still not 'admin', check:
-- 1. Does the profile exist? (should show a row)
-- 2. Is the role column there? (should show 'admin')
-- 3. Try refreshing the admin dashboard and logging in again










