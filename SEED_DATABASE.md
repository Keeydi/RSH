# Database Seeding Guide

This guide will help you seed your Supabase database with all required tables, functions, and initial data.

## Prerequisites

1. **Supabase Project**: Make sure your Supabase project is active and accessible
2. **Connection String**: `postgresql://postgres:Karldarn25!@db.yatiljvrbvnkxkkgsjyg.supabase.co:5432/postgres`
3. **Supabase Dashboard Access**: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg

## Method 1: Automated Seeding (Recommended)

Run the automated seeding script:

```bash
node scripts/seed-database.js
```

This will automatically execute all SQL files in the correct order.

## Method 2: Manual Seeding via Supabase SQL Editor

If the automated script fails, you can run the SQL files manually:

### Step 1: Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new

### Step 2: Run SQL Files in Order

Execute each SQL file in the following order:

#### 1. Core Setup (`database/setup.sql`)
- Creates `profiles` table
- Sets up Row Level Security (RLS) policies
- Creates trigger for automatic profile creation on user signup

#### 2. Emergency Contacts (`database/emergency_contacts.sql`)
- Creates `emergency_contacts` table
- Sets up RLS policies
- Creates triggers for maintaining single primary contact

#### 3. Emergency Requests (`database/emergency_requests.sql`)
- Creates `emergency_requests` table
- Adds `role` column to `profiles` table
- Sets up RLS policies for students and admins

#### 4. OTP Setup (`database/otp_setup.sql`)
- Creates `otp_codes` table
- Creates functions for generating and verifying OTP codes

#### 5. Admin Account (Optional) (`database/seed_admin_account.sql`)
- Instructions for creating admin user
- Sets admin role for the user

### Step 3: Verify Seeding

After running all SQL files, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show:
-- emergency_contacts
-- emergency_requests
-- otp_codes
-- profiles
```

## Method 3: Using Migration Scripts

You can also use the migration scripts:

### PowerShell:
```powershell
.\scripts\run-migration.ps1
```

### Batch (Windows):
```cmd
.\scripts\run-migration.bat
```

### Node.js:
```bash
node scripts/run-migration.js
```

## Important: Update API Keys

After seeding, you need to:

1. **Get your Anon Key** from Supabase Dashboard:
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api
   - Copy the `anon` / `public` key

2. **Update the Anon Key** in:
   - `config/supabase.ts` - Replace `YOUR_ANON_KEY_HERE`
   - `admin/index.html` - Replace `YOUR_ANON_KEY_HERE`

## Troubleshooting

### Connection Issues
- Verify your Supabase project is active (not paused)
- Check the connection string is correct
- Ensure your IP is allowed in Supabase network settings

### Permission Errors
- Make sure you're using the correct database user
- Check Row Level Security policies are set correctly

### Table Already Exists
- If tables already exist, the scripts use `CREATE TABLE IF NOT EXISTS`
- You may need to drop existing tables if you want a fresh start

## Next Steps

After seeding:
1. ✅ Update API keys in config files
2. ✅ Test database connection
3. ✅ Create admin user (if needed)
4. ✅ Test authentication flow
5. ✅ Test emergency features

## Support

If you encounter issues:
- Check Supabase Dashboard logs
- Review SQL file comments for specific instructions
- Verify all dependencies are installed: `npm install`



