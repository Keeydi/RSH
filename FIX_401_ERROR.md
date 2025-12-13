# Fix 401 Unauthorized Error

## The Problem
You're getting a `401 (Unauthorized)` error because the Supabase Anon Key is still set to the placeholder `'YOUR_ANON_KEY_HERE'`.

## Quick Fix (3 Steps)

### Step 1: Get Your Anon Key

1. **Open Supabase Dashboard:**
   - Direct link: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api

2. **Find the API Keys Section:**
   - Look for "Project API keys"
   - You'll see two keys:
     - `anon` / `public` ← **This is the one you need**
     - `service_role` (secret) ← Don't use this one

3. **Copy the `anon` / `public` key:**
   - It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdGlsanZ2YnZua3hrZ2dzenlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3...` (a long JWT token)

### Step 2: Update config/supabase.ts

Replace line 7:
```typescript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With:
```typescript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your actual key here
```

### Step 3: Update admin/index.html

Replace line 757:
```javascript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With:
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your actual key here
```

### Step 4: Restart Your Dev Server

After updating both files:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

## Verification

After updating, the 401 error should be gone. You should be able to:
- ✅ Sign up new users
- ✅ Sign in existing users
- ✅ Access Supabase database

## Security Note

- ✅ The `anon` / `public` key is **safe** to use in client-side code
- ❌ **NEVER** expose the `service_role` key in client-side code
- The anon key is restricted by Row Level Security (RLS) policies

## Still Getting 401?

If you still get 401 after updating:

1. **Verify the key is correct:**
   - Make sure you copied the entire key (it's very long)
   - Check for any extra spaces or line breaks

2. **Check Supabase project status:**
   - Make sure your project is active (not paused)
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg

3. **Verify database is seeded:**
   - Make sure you've run the database setup scripts
   - See: `SEED_DATABASE.md`

4. **Check browser console:**
   - Look for any other error messages
   - Check Network tab for the actual request/response

