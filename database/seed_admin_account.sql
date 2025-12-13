-- Seed Admin Account: rhs@gmail.com / admin123
-- Run this in Supabase SQL Editor

-- Step 1: Add role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Step 2: Create the user in Supabase Auth Dashboard first, then run this:
-- Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
-- Click "Add User"
-- Email: rhs@gmail.com
-- Password: admin123
-- Click "Create User"

-- Step 3: After creating the user, set them as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'rhs@gmail.com';

-- Step 4: Verify the admin account was created
SELECT id, email, full_name, role, created_at
FROM public.profiles 
WHERE email = 'rhs@gmail.com';

-- If the user doesn't exist yet, you'll need to create it in the Auth Dashboard first.
-- The profile will be automatically created when the user signs up or is created in Auth.










