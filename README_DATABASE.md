# Database Setup Guide

## Quick Start

### One-Time Setup (Run Once)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new

2. **Run the Complete Setup:**
   - Open `database/complete_setup.sql`
   - Copy ALL the contents
   - Paste into Supabase SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)

3. **Verify Tables Created:**
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/editor
   - You should see these tables:
     - ✅ `profiles`
     - ✅ `emergency_contacts`
     - ✅ `emergency_requests`
     - ✅ `otp_codes`

## What Gets Created

### Tables
1. **profiles** - User profile information
2. **emergency_contacts** - User's emergency contacts
3. **emergency_requests** - Emergency help requests
4. **otp_codes** - One-time password codes for email verification

### Functions
- `handle_new_user()` - Auto-creates profile when user signs up
- `generate_otp_code()` - Generates OTP codes
- `verify_otp_code()` - Verifies OTP codes
- `get_latest_otp()` - Gets latest OTP for email
- `update_emergency_contact_updated_at()` - Updates timestamp
- `ensure_single_primary_contact()` - Ensures only one primary contact
- `set_emergency_request_user_info()` - Auto-fills user info

### Triggers
- Auto-creates profile on user signup
- Auto-updates timestamps
- Auto-fills emergency request user info
- Ensures single primary contact

### Security (Row Level Security)
- All tables have RLS enabled
- Users can only access their own data
- Admins can view all emergency requests

## After Setup

### Create a Test User
See `CREATE_TEST_USER.md` for instructions.

### Create Admin User
See `database/seed_admin_account.sql` for instructions.

## Troubleshooting

### "Table already exists"
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- It's safe to run multiple times

### "Policy already exists"
- The script drops and recreates policies
- This is safe and ensures clean setup

### "Function already exists"
- Functions are replaced with `CREATE OR REPLACE`
- This is safe

## Individual Files (Optional)

If you prefer to run files separately:

1. `database/setup.sql` - Profiles table
2. `database/emergency_contacts.sql` - Emergency contacts
3. `database/emergency_requests.sql` - Emergency requests
4. `database/otp_setup.sql` - OTP codes
5. `database/otp_trigger.sql` - OTP triggers (optional)

**But it's easier to just run `complete_setup.sql` once!**


