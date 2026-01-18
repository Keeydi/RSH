-- ============================================================================
-- Seed Admin Account: admin@admin
-- ============================================================================
-- This script seeds an admin account with email "admin@admin" and verifies it.
-- 
-- IMPORTANT: You must first create the user via Supabase Dashboard or Admin API
-- before running this script, as you cannot directly insert into auth.users via SQL.
--
-- Steps:
-- 1. Create user via Supabase Dashboard > Auth > Users
--    - Email: admin@admin
--    - Password: admin123456 (or your preferred password)
--    - Toggle ON "Auto Confirm User" to verify email
-- 2. Run this SQL script to set role and verify account
-- ============================================================================

-- Step 1: Set user as admin (if profile exists)
SELECT public.set_user_admin('admin@admin');

-- Step 2: Verify the account was set correctly
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  u.email_confirmed_at,
  u.created_at as user_created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as verification_status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@admin';

-- Step 3: If user exists but email is not confirmed, you can verify it via Admin API
-- Note: You cannot directly update auth.users.email_confirmed_at via SQL for security reasons.
-- Use the Supabase Admin API or Dashboard to verify the email.
--
-- To verify via Admin API (using a script or curl):
-- curl -X PUT 'https://yatiljvrbvnkxkkgsjyg.supabase.co/auth/v1/admin/users/{user_id}' \
--   -H "apikey: YOUR_SERVICE_ROLE_KEY" \
--   -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
--   -H "Content-Type: application/json" \
--   -d '{"email_confirm": true}'

-- ============================================================================
-- Verification Summary
-- ============================================================================
-- After running this script, check:
-- 1. Profile exists with role = 'admin' ✅
-- 2. Email is verified (email_confirmed_at is not null) ✅
-- 3. You can login with: admin@admin
-- ============================================================================



