-- Confirm Email for Admin Account: rhs@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: Confirm the email (set email_confirmed_at)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'rhs@gmail.com';

-- Step 2: Verify email is confirmed
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'rhs@gmail.com';

-- Step 3: Make sure role is set to admin
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'rhs@gmail.com';

-- Step 4: Final verification - check both auth and profile
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'rhs@gmail.com';

-- If email_confirmed_at is still NULL after running this, 
-- you may need to use the Service Role Key or recreate the user.










