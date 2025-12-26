# Seed Test Accounts

This guide will help you create multiple test accounts for your app.

## Quick Method: Automated Script

### Option 1: With Service Role Key (Recommended)

1. **Get your Service Role Key:**
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api
   - Copy the `service_role` key (⚠️ Keep this secret!)

2. **Run the script:**
   ```powershell
   # Set the service role key
   $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   
   # Run the script
   node scripts/seed-accounts.js
   ```

This will automatically create 4 test accounts:
- ✅ `student@test.com` (student role)
- ✅ `teacher@test.com` (teacher role)
- ✅ `admin@test.com` (admin role)
- ✅ `test@example.com` (student role)

All passwords: `test123456`

---

## Manual Method: Via Supabase Dashboard

### Step 1: Create Users

1. Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users**
2. Click **"Add User"** for each account:

#### Account 1: Student
- **Email:** `student@test.com`
- **Password:** `test123456`
- **Auto Confirm User:** ✅ ON
- Click **"Create User"**

#### Account 2: Teacher
- **Email:** `teacher@test.com`
- **Password:** `test123456`
- **Auto Confirm User:** ✅ ON
- Click **"Create User"**

#### Account 3: Admin
- **Email:** `admin@test.com`
- **Password:** `test123456`
- **Auto Confirm User:** ✅ ON
- Click **"Create User"**

#### Account 4: General Test
- **Email:** `test@example.com`
- **Password:** `test123456`
- **Auto Confirm User:** ✅ ON
- Click **"Create User"**

### Step 2: Set Roles and Add Test Data

1. Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new**
2. Open `database/seed_test_accounts.sql`
3. Copy and paste into SQL Editor
4. Click **"Run"**

This will:
- ✅ Set roles for each user
- ✅ Add emergency contacts for the student account
- ✅ Verify all accounts were created

---

## Test Account Credentials

After seeding, you can login with:

### Student Account
- **Email:** `student@test.com`
- **Password:** `test123456`
- **Role:** student
- **Has emergency contacts:** Yes

### Teacher Account
- **Email:** `teacher@test.com`
- **Password:** `test123456`
- **Role:** teacher

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `test123456`
- **Role:** admin
- **Can view:** All emergency requests

### General Test Account
- **Email:** `test@example.com`
- **Password:** `test123456`
- **Role:** student

---

## Verify Accounts

After creating accounts, verify they exist:

1. Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users**
2. You should see all 4 users listed
3. Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/editor**
4. Open `profiles` table
5. You should see all 4 profiles with correct roles

---

## Troubleshooting

### "User already exists"
- The email is already registered
- You can still use that account to login
- Or delete it first and recreate

### "Profile not found"
- Wait a few seconds after creating user
- The profile is created automatically by a trigger
- Run the SQL script again to update roles

### "Cannot login"
- Make sure "Auto Confirm User" was ON when creating
- Or check your email for confirmation link
- Verify password is correct

---

## Next Steps

After seeding accounts:
1. ✅ Try logging in with any test account
2. ✅ Test different user roles
3. ✅ Verify emergency contacts work
4. ✅ Test admin dashboard access

---

## Customize Accounts

To create your own test accounts:

1. Edit `scripts/seed-accounts.js` - modify `TEST_ACCOUNTS` array
2. Or manually create users in Dashboard
3. Update `database/seed_test_accounts.sql` with your emails



