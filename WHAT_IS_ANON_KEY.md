# What is the Supabase Anon Key?

## ❌ Common Mistake
**DO NOT use the URL as the anon key!**

```typescript
// ❌ WRONG - This is the URL, not the key!
const SUPABASE_ANON_KEY = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
```

## ✅ Correct Format
The anon key is a **JWT token** (JSON Web Token) that looks like this:

```typescript
// ✅ CORRECT - This is a JWT token
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdGlsanZ2YnZua3hrZ2dzenlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDkxOTUsImV4cCI6MjA3ODYyNTE5NX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

## How to Get It

### Step 1: Open Supabase Dashboard
Go to: **https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api**

### Step 2: Find "Project API keys" Section
You'll see something like this:

```
┌─────────────────────────────────────────────────────────────┐
│ Project API keys                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  anon / public                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh│   │
│  │ YmFzZSIsInJlZiI6InlhdGlsanZ2YnZua3hrZ2dzenlnIiwicm9s│   │
│  │ ZSI6ImFub24iLCJpYXQiOjE3NjMwNDkxOTUsImV4cCI6MjA3ODYy│   │
│  │ NTE5NX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx│   │
│  └─────────────────────────────────────────────────────┘   │
│  [Copy] [Reveal]                                             │
│                                                               │
│  service_role (secret)                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...              │   │
│  └─────────────────────────────────────────────────────┘   │
│  [Copy] [Reveal]                                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Copy the "anon / public" Key
- Click the **"Copy"** button next to **"anon / public"**
- **DO NOT** copy the "service_role" key (that's secret and dangerous!)

### Step 4: Paste It in Your Code

**In `config/supabase.ts` (line 7):**
```typescript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your actual key here
```

**In `admin/index.html` (line 757):**
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your actual key here
```

## Key Characteristics

✅ **Starts with:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
✅ **Very long:** Usually 200+ characters
✅ **Has dots:** Contains `.` separators (JWT format)
✅ **Three parts:** `header.payload.signature`

❌ **NOT a URL:** Doesn't start with `https://`
❌ **NOT short:** Not just a few characters
❌ **NOT the service_role:** That's a different key

## Visual Example

```
URL (what you have now - WRONG):
https://yatiljvrbvnkxkkgsjyg.supabase.co

Anon Key (what you need - CORRECT):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdGlsanZ2YnZua3hrZ2dzenlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDkxOTUsImV4cCI6MjA3ODYyNTE5NX0.hLXtGAixJbKBaipeghYvxFlYh5X608mFgV_jb4BYXfA
```

## Still Confused?

1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/settings/api
2. Look for the **long text** that starts with `eyJ...`
3. That's your anon key!
4. Copy the entire thing (it's very long)
5. Paste it in both files

## After Updating

1. Save both files
2. Restart your dev server: `npm start`
3. The 401 error should be gone!



