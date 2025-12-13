# Create User Account - Step by Step

Since you're using a different Supabase account, let's create a user directly in THIS project.

## Step 1: Create User in Supabase Dashboard

1. **Go to Auth Users:**
   - Open: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users

2. **Click "Add User"** (green button, top right)

3. **Fill in the form:**
   - **Email:** `test@example.com` (or any email you want)
   - **Password:** `test123456` (must be at least 6 characters)
   - **Auto Confirm User:** ✅ **Toggle this ON** (important!)
   - **User Metadata (optional):**
     - Key: `full_name`
     - Value: `Test User`

4. **Click "Create User"**

## Step 2: Check if Profile Was Created

1. **Go to Table Editor:**
   - Open: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/editor
   - Click on `profiles` table

2. **Refresh the table** (click refresh icon)

3. **You should see:**
   - A row with your email
   - `full_name` from metadata
   - `role` set to 'student' (default)

## Step 3: If Profile Still Empty

Run the diagnostic check:

1. **Go to SQL Editor:**
   - Open: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new

2. **Run diagnostic:**
   - Open `database/DIAGNOSTIC_CHECK.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

3. **Look at the results:**
   - **CHECK 1:** Should show how many users exist
   - **CHECK 2:** Should show how many profiles exist
   - **CHECK 3:** Shows users without profiles
   - **CHECK 4 & 5:** Check if trigger is set up

## Step 4: Fix Based on Results

### If CHECK 1 shows 0 users:
→ You need to create a user (Step 1 above)

### If CHECK 1 shows users but CHECK 2 shows 0 profiles:
→ Run `database/FIX_EMPTY_PROFILES.sql`

### If CHECK 4 or CHECK 5 shows "NO":
→ Run `database/complete_setup.sql` first (to set up triggers)

## Quick Test

After creating a user, try logging in to your app:
- **Email:** The email you used
- **Password:** The password you set

If login works, the profile was created automatically!

## Still Having Issues?

Share the results from `DIAGNOSTIC_CHECK.sql` and I can help troubleshoot further.


