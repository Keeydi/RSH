# Quick Reference: Get Your Supabase Anon Key

## Direct Link
https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api

## What to Look For

In the Supabase Dashboard API Settings page, you'll see:

```
Project API keys
┌─────────────────────────────────────────────────────────┐
│ anon / public                                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...                │
│ [Copy] [Reveal]                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ service_role (secret)                                    │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...                │
│ [Copy] [Reveal]                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy the `anon / public` key** (the first one, NOT service_role)

## Where to Paste It

1. **config/supabase.ts** - Line 7
2. **admin/index.html** - Line 757

Replace `'YOUR_ANON_KEY_HERE'` with your actual key (keep the quotes).



