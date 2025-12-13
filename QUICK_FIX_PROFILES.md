# Quick Fix: Empty Profiles Table

## Problem
Your `profiles` table is empty even though you created users.

## Solution: Run This SQL

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new

2. **Run the Fix Script:**
   - Open `database/FIX_EMPTY_PROFILES.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click **"Run"**

3. **Refresh Table Editor:**
   - Go back to Table Editor
   - Click refresh button
   - You should now see profiles!

## What This Does

The script will:
- ✅ Find ALL users in `auth.users`
- ✅ Create profiles for users that don't have one
- ✅ Set proper names and roles for test accounts
- ✅ Show you all created profiles

## If Still Empty

### Check 1: Do users exist?
Run this in SQL Editor:
```sql
SELECT id, email FROM auth.users;
```

If this returns nothing, you need to create users first:
- Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users
- Click "Add User"

### Check 2: Is the trigger working?
Run this in SQL Editor:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If this returns nothing, the trigger isn't set up. Run:
- `database/complete_setup.sql` (to set up the trigger)

## After Running the Fix

You should see profiles appear in the Table Editor. If you created test accounts, you'll see:
- `student@test.com` - Test Student (student)
- `teacher@test.com` - Test Teacher (teacher)
- `admin@test.com` - Test Admin (admin)
- `test@example.com` - Test User (student)

## Next Steps

After profiles are created:
1. ✅ Try logging in with test accounts
2. ✅ Verify roles are set correctly
3. ✅ Test the app functionality


