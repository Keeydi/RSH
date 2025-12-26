# Fix 400 Bad Request Error

## What Changed
✅ **Good news:** You're no longer getting 401 (Unauthorized) - your anon key is working!
❌ **New issue:** 400 Bad Request means the request format is correct, but something is wrong with the data.

## Common Causes

### 1. User Doesn't Exist
**Problem:** You're trying to sign in with an email that hasn't been created yet.

**Solution:**
- **Option A:** Sign up first using the "Sign Up" button in the app
- **Option B:** Create a user in Supabase Dashboard:
  1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
  2. Click "Add User"
  3. Enter email and password
  4. Click "Create User"

### 2. Email Not Confirmed
**Problem:** Supabase requires email confirmation, but the email hasn't been verified.

**Solution:**
- Check your email inbox for a confirmation link
- Or disable email confirmation in Supabase:
  1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/settings
  2. Find "Enable email confirmations"
  3. Toggle it OFF (for development only)

### 3. Invalid Email/Password Format
**Problem:** The email or password doesn't meet Supabase requirements.

**Requirements:**
- Email: Must be a valid email format (e.g., `user@example.com`)
- Password: Must be at least 6 characters

### 4. Database Not Seeded
**Problem:** The database tables might not exist yet.

**Solution:** Run the database seeding scripts:
- See `SEED_DATABASE.md` for instructions
- Or run SQL files manually in Supabase SQL Editor

## Quick Test Steps

### Step 1: Try Sign Up First
1. Open the app
2. Click "Sign Up"
3. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123` (at least 6 characters)
4. Click "Create Account"

### Step 2: Check Email Confirmation
- If email confirmation is enabled, check your inbox
- Or disable it in Supabase settings (for development)

### Step 3: Try Sign In
1. Use the email and password you just created
2. Click "Sign In"

## Check Browser Console

Open browser DevTools (F12) and check:
1. **Network tab:** Look at the actual request/response
2. **Console tab:** Look for error messages

The error response should show what's wrong:
```json
{
  "error": "Invalid login credentials"
}
// or
{
  "error": "Email not confirmed"
}
```

## Create Test User via SQL

If you want to create a user directly in the database:

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new
2. Run this SQL (replace email/password):

```sql
-- Create a test user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('test123', gen_salt('bf')), -- Password: test123
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User"}'
);
```

**Note:** This is complex. It's easier to use the Supabase Dashboard or sign up through the app.

## Recommended: Disable Email Confirmation (Development)

For development, you can disable email confirmation:

1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/settings
2. Scroll to "Email Auth"
3. Toggle OFF "Enable email confirmations"
4. Save changes

This allows you to sign in immediately after sign up.

## Still Getting 400?

Check the exact error message in:
1. Browser console (F12 → Console tab)
2. Network tab → Click the failed request → Response tab

Share the exact error message for more specific help.



