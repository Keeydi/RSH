-- Debug and Fix Admin Account: rhs@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists in auth.users
SELECT id, email, email_confirmed_at, created_at, encrypted_password IS NOT NULL as has_password
FROM auth.users 
WHERE email = 'rhs@gmail.com';

-- Step 2: If user doesn't exist, you need to create it in Auth Dashboard first
-- Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
-- Click "Add User"
-- Email: rhs@gmail.com
-- Password: admin123
-- CHECK "Auto Confirm User" ✅
-- Click "Create User"

-- Step 3: If user exists but email_confirmed_at is NULL, confirm it
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'rhs@gmail.com';

-- Step 4: Ensure profile exists and has admin role
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'admin', 'Admin User'
FROM auth.users
WHERE email = 'rhs@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', email = EXCLUDED.email;

-- Step 5: Add role column if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Step 6: Final check - verify everything is set up correctly
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    CASE WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmed' ELSE '❌ Not Confirmed' END as email_status,
    CASE WHEN u.encrypted_password IS NOT NULL THEN '✅ Has Password' ELSE '❌ No Password' END as password_status,
    p.role,
    CASE WHEN p.role = 'admin' THEN '✅ Admin' ELSE '❌ Not Admin' END as role_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'rhs@gmail.com';

-- If user doesn't exist, you MUST create it in the Auth Dashboard first!
-- The SQL above can only update existing users, not create them.










