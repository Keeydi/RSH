-- ============================================================================
-- Seed Test Accounts
-- ============================================================================
-- This script creates test user accounts in Supabase
-- 
-- IMPORTANT: Users must be created via Supabase Auth Dashboard first!
-- This SQL will then populate their profiles with test data.
--
-- Steps:
-- 1. Create users in Supabase Dashboard > Auth > Users (see below)
-- 2. Run this SQL to update their profiles
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Users in Supabase Dashboard First
-- ============================================================================
-- Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
-- 
-- Create these users (click "Add User" for each):
-- 
-- 1. Email: student@test.com, Password: test123456, Auto Confirm: ON
-- 2. Email: teacher@test.com, Password: test123456, Auto Confirm: ON
-- 3. Email: admin@test.com, Password: test123456, Auto Confirm: ON
-- 4. Email: test@example.com, Password: test123456, Auto Confirm: ON
-- ============================================================================

-- ============================================================================
-- STEP 2: Update Profiles with Test Data
-- ============================================================================
-- After creating users above, run this SQL to update their profiles

-- Update student account
UPDATE public.profiles 
SET 
  full_name = 'Test Student',
  role = 'student'
WHERE email = 'student@test.com';

-- Update teacher account
UPDATE public.profiles 
SET 
  full_name = 'Test Teacher',
  role = 'teacher'
WHERE email = 'teacher@test.com';

-- Update admin account
UPDATE public.profiles 
SET 
  full_name = 'Test Admin',
  role = 'admin'
WHERE email = 'admin@test.com';

-- Update general test account
UPDATE public.profiles 
SET 
  full_name = 'Test User',
  role = 'student'
WHERE email = 'test@example.com';

-- ============================================================================
-- STEP 3: Add Emergency Contacts for Test Users
-- ============================================================================

-- Add emergency contacts for student@test.com
-- (Replace user_id with actual UUID from auth.users after creating the user)
INSERT INTO public.emergency_contacts (user_id, name, relationship, phone, email, is_primary)
SELECT 
  id,
  'Emergency Contact 1',
  'Parent',
  '+1234567890',
  'parent1@example.com',
  true
FROM public.profiles
WHERE email = 'student@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.emergency_contacts (user_id, name, relationship, phone, email, is_primary)
SELECT 
  id,
  'Emergency Contact 2',
  'Guardian',
  '+1234567891',
  'guardian@example.com',
  false
FROM public.profiles
WHERE email = 'student@test.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY: Check Created Accounts
-- ============================================================================

-- View all profiles
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE email IN ('student@test.com', 'teacher@test.com', 'admin@test.com', 'test@example.com')
ORDER BY role, email;

-- View emergency contacts
SELECT 
  ec.id,
  p.email as user_email,
  ec.name,
  ec.relationship,
  ec.phone,
  ec.is_primary
FROM public.emergency_contacts ec
JOIN public.profiles p ON ec.user_id = p.id
WHERE p.email IN ('student@test.com', 'teacher@test.com', 'admin@test.com', 'test@example.com')
ORDER BY p.email, ec.is_primary DESC;

-- ============================================================================
-- TEST ACCOUNTS SUMMARY
-- ============================================================================
-- 
-- Student Account:
--   Email: student@test.com
--   Password: test123456
--   Role: student
--   Has emergency contacts: Yes
--
-- Teacher Account:
--   Email: teacher@test.com
--   Password: test123456
--   Role: teacher
--
-- Admin Account:
--   Email: admin@test.com
--   Password: test123456
--   Role: admin
--   Can view all emergency requests
--
-- General Test Account:
--   Email: test@example.com
--   Password: test123456
--   Role: student
--
-- ============================================================================



