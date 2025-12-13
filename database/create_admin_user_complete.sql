-- Complete Admin User Creation Script
-- Run this in Supabase SQL Editor
-- This will help you create rhs@gmail.com / admin123

-- Step 1: Add role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Step 2: Check if user already exists
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'rhs@gmail.com';

-- Step 3: If user exists, set as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'rhs@gmail.com';

-- Step 4: If user doesn't exist, you need to create it via Supabase Dashboard:
-- Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
-- Click "Add User" button
-- Email: rhs@gmail.com
-- Password: admin123
-- IMPORTANT: Check "Auto Confirm User" checkbox
-- Click "Create User"
-- Then come back and run Step 3 again

-- Step 5: Verify admin account
SELECT p.id, p.email, p.full_name, p.role, u.email_confirmed_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'rhs@gmail.com';

-- If email_confirmed_at is NULL, you need to confirm the email:
-- Option A: Check "Auto Confirm User" when creating
-- Option B: Manually confirm in Auth Dashboard
-- Option C: Run this (requires service role key - use Supabase Dashboard SQL Editor):
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'rhs@gmail.com';










