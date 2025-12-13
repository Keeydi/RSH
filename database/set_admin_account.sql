-- Set Admin Account
-- Run this in Supabase SQL Editor to create/set an admin account

-- Step 1: Add role column to profiles table (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Step 2: Option A - Set an EXISTING user as admin
-- Replace 'your-email@example.com' with the email of the user you want to make admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Step 2: Option B - Create a new admin user manually
-- First, create the user in Supabase Auth Dashboard, then run:
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'admin@example.com';

-- Step 3: Verify admin account was created
SELECT id, email, full_name, role 
FROM public.profiles 
WHERE role = 'admin';

-- Example: Set your own account as admin
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-actual-email@gmail.com';










