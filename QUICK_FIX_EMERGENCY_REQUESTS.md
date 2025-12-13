# ⚠️ QUICK FIX: Create Emergency Requests Table

## The Problem
The admin dashboard is showing a 404 error because the `emergency_requests` table doesn't exist in your Supabase database.

## The Solution
Run the SQL migration to create the table.

## Steps:

### 1. Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/wekstuztpuuiqkkwpufs/sql/new

### 2. Copy the SQL Below
Copy ALL the SQL from `database/emergency_requests.sql` file

### 3. Paste and Run
- Paste into the SQL Editor
- Click "Run" button (or press Ctrl+Enter)

### 4. Verify
After running, verify with this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'emergency_requests';
```

You should see `emergency_requests` in the results.

### 5. Refresh Admin Dashboard
Refresh your browser and the errors should be gone!

---

## What This Creates:
- ✅ Ensures `profiles.role` column exists (required for admin policies)
- ✅ `emergency_requests` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Auto-populate user info trigger
- ✅ Admin can view all requests
- ✅ Students can create their own requests

**Note:** The SQL file is now self-contained and will automatically ensure the `role` column exists in the `profiles` table before creating the `emergency_requests` table.

After this, when students click "Need Help", it will appear on the admin map!

---

## Troubleshooting: SOS Button Not Showing on Admin Map

If you clicked SOS but nothing appears on the Admin Map:

### Step 1: Check if Table Exists
Run this query in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'emergency_requests';
```

If it returns nothing, run `database/emergency_requests.sql` first.

### Step 2: Verify Request Was Created
1. Go to Supabase Dashboard → Table Editor → `emergency_requests`
2. Check if a new row appears after clicking SOS
3. Verify the row has:
   - `status` = 'active'
   - `latitude` and `longitude` values
   - `user_id` matches your logged-in user

### Step 3: Check Admin Map
1. Make sure you're logged in as admin in the admin dashboard
2. Click the "Map" tab in the admin dashboard
3. The map should auto-refresh, but try refreshing the page if needed
4. Check browser console (F12) for any errors

### Step 4: Check Mobile App
1. Make sure you're logged in
2. Grant location permission when prompted
3. Check the alert message after clicking SOS:
   - ✅ Success = Request was created
   - ❌ Error = Check the error message for specific issue

### Common Issues:
- **Table doesn't exist**: Run `database/emergency_requests.sql`
- **Permission denied**: Check RLS policies are set up correctly
- **Not logged in**: Login required to create requests
- **Location permission denied**: Grant location permission in app settings

