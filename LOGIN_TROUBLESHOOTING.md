# Login Error Troubleshooting Guide

## Common Login Errors and Solutions

### 1. **Network/Connection Error**
**Error:** "Network request failed" or "Unable to connect"

**Solutions:**
- ✅ Check internet connection on device
- ✅ Verify Supabase URL is accessible: `https://yatiljvrbvnkxkkgsjyg.supabase.co`
- ✅ Check if device firewall/antivirus is blocking connections
- ✅ Try on different network (WiFi vs Mobile Data)

### 2. **Invalid Credentials**
**Error:** "Invalid login credentials" or "Invalid email or password"

**Solutions:**
- ✅ Verify email and password are correct
- ✅ Check if user exists in Supabase:
  - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
  - Check if your email exists
- ✅ Try creating a new account first
- ✅ Use the admin account: `admin@admin` / `admin123456`

### 3. **Email Not Confirmed**
**Error:** "Email not confirmed" or "Please verify your email"

**Solutions:**
- ✅ Check email inbox for verification link
- ✅ In Supabase Dashboard, manually confirm email:
  - Go to Auth > Users
  - Find your user
  - Click "Confirm Email" or set `email_confirmed_at`
- ✅ Or run this SQL in Supabase SQL Editor:
  ```sql
  UPDATE auth.users 
  SET email_confirmed_at = NOW() 
  WHERE email = 'your-email@example.com';
  ```

### 4. **User Doesn't Exist**
**Error:** "User not found"

**Solutions:**
- ✅ Create account first using "Sign Up" button
- ✅ Or create user in Supabase Dashboard:
  - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
  - Click "Add User"
  - Enter email and password
  - Toggle ON "Auto Confirm User"

### 5. **Supabase Configuration Error**
**Error:** "Configuration error" or "API key invalid"

**Solutions:**
- ✅ Verify Supabase URL in `config/supabase.ts`:
  - Should be: `https://yatiljvrbvnkxkkgsjyg.supabase.co`
- ✅ Check Supabase project is active
- ✅ Verify API keys are correct

## Quick Fix: Create Test Account

### Option 1: Via App
1. Open the app
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@test.com
   - Password: test123456
4. Accept terms
5. Create account
6. Try logging in

### Option 2: Via Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
2. Click "Add User"
3. Enter:
   - Email: test@test.com
   - Password: test123456
4. Toggle ON "Auto Confirm User"
5. Click "Create User"
6. Try logging in with these credentials

### Option 3: Use Admin Account
If you seeded the admin account:
- Email: `admin@admin`
- Password: `admin123456`

## Check What Error You're Getting

1. **Look at the error message** - What does it say exactly?
2. **Check device console/logs** - Any network errors?
3. **Try on different device/network** - Is it device-specific?

## Debug Steps

1. **Test Supabase Connection:**
   - Open browser
   - Go to: https://yatiljvrbvnkxkkgsjyg.supabase.co
   - Should load (might show API docs or error page, but should respond)

2. **Check User Exists:**
   - Go to Supabase Dashboard > Auth > Users
   - Verify your email is listed

3. **Verify Email Confirmed:**
   - In Supabase Dashboard > Auth > Users
   - Check if `email_confirmed_at` has a date
   - If null, email is not confirmed

4. **Test with Known Good Account:**
   - Use admin@admin if you seeded it
   - Or create a fresh test account

## Still Having Issues?

**Share these details:**
1. Exact error message
2. What email you're trying to use
3. Whether you created the account or it was pre-existing
4. Network type (WiFi/Mobile Data)
5. Device type (Android/iOS)

## Common Solutions Summary

```sql
-- If email not confirmed, run this in Supabase SQL Editor:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';

-- Check if user exists:
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';
```
