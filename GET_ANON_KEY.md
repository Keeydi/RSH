# How to Get Your Supabase Anon Key

## Quick Steps

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api

2. **Find the API Keys Section**
   - Look for "Project API keys"
   - You'll see two keys: `anon` / `public` and `service_role` (secret)

3. **Copy the `anon` / `public` key**
   - This is the one you need (NOT the service_role key)
   - It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a long JWT token)

4. **Update the files:**
   - `config/supabase.ts` - Replace `YOUR_ANON_KEY_HERE` on line 7
   - `admin/index.html` - Replace `YOUR_ANON_KEY_HERE` on line 757

## Alternative: Direct Link

Click this link to go directly to your API settings:
https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api

## Security Note

- ✅ The `anon` / `public` key is safe to use in client-side code
- ❌ NEVER expose the `service_role` key in client-side code
- The anon key is restricted by Row Level Security (RLS) policies

## After Updating

Once you've updated both files with the correct anon key:
1. Save the files
2. Restart your Expo development server
3. The 401 authentication error should be resolved


