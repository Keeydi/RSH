# Create Test User Account

This guide will help you create a test user account so you can log in to the app.

## Quick Method: Via Supabase Dashboard (Recommended)

### Step 1: Open Supabase Auth Dashboard
Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users**

### Step 2: Create New User
1. Click the **"Add User"** button (top right)
2. Fill in the form:
   - **Email:** `test@example.com` (or any email you prefer)
   - **Password:** `test123456` (must be at least 6 characters)
   - **Auto Confirm User:** Toggle **ON** ✅ (this allows immediate login)
3. Click **"Create User"**

### Step 3: Login to App
Now you can log in to your app with:
- **Email:** `test@example.com`
- **Password:** `test123456`

---

## Alternative: Use the Script

### Option 1: With Service Role Key (Automated)
```bash
# Set your service role key (get it from Supabase Dashboard > Settings > API)
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the script
node scripts/create-test-user.js
```

### Option 2: Without Service Role Key (Manual)
```bash
# Just run the script - it will show you manual steps
node scripts/create-test-user.js
```

---

## Create Admin User

If you want to create an admin user (for the admin dashboard):

### Step 1: Create User (same as above)
Use email: `admin@example.com` or `rhs@gmail.com`

### Step 2: Set Admin Role
1. Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new**
2. Run this SQL (replace email with your admin email):

```sql
-- Make sure profiles table has role column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'member'));

-- Set user as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'test@example.com'; -- Replace with your admin email

-- Verify
SELECT id, email, full_name, role, created_at
FROM public.profiles 
WHERE email = 'test@example.com'; -- Replace with your admin email
```

---

## Test User Credentials (Default)

If you use the script, it creates:
- **Email:** `test@example.com`
- **Password:** `test123456`
- **Name:** `Test User`

You can change these in `scripts/create-test-user.js` if needed.

---

## Troubleshooting

### "User already exists"
- The email is already registered
- Try a different email or delete the existing user first

### "Email not confirmed"
- Make sure you toggled **"Auto Confirm User"** ON when creating the user
- Or check your email for a confirmation link

### "Invalid login credentials"
- Double-check the email and password
- Make sure there are no extra spaces

### "400 Bad Request"
- Make sure the database tables are created (run `database/setup.sql`)
- Check that the user was created successfully in Supabase Dashboard

---

## Next Steps

After creating the user:
1. ✅ Try logging in with the credentials
2. ✅ If you get errors, check the browser console (F12)
3. ✅ Verify the user exists in Supabase Dashboard

---

## Multiple Test Users

You can create multiple test users with different roles:

```sql
-- Create student user
-- (Create via Dashboard first, then run:)
UPDATE public.profiles SET role = 'student' WHERE email = 'student@example.com';

-- Create teacher user
UPDATE public.profiles SET role = 'teacher' WHERE email = 'teacher@example.com';

-- Create admin user
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
```



