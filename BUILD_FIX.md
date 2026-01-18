# Fixing EAS Build Git Error

## Problem
EAS CLI requires Git to track changes and manage builds. If you see:
```
git command not found
```
or
```
git found, but git --help exited with status undefined
```

## Solution 1: Install Git (Recommended)

### For Windows:

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Download the installer
   - Run the installer with default settings

2. **Verify Installation:**
   ```powershell
   git --version
   ```

3. **Configure Git (if needed):**
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. **Restart your terminal/PowerShell** after installation

5. **Try building again:**
   ```powershell
   eas build --platform android --profile production
   ```

## Solution 2: Bypass Git (Not Recommended)

If you don't want to use Git, you can set an environment variable:

### For PowerShell (Current Session):
```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile production
```

### For PowerShell (Permanent):
```powershell
[System.Environment]::SetEnvironmentVariable('EAS_NO_VCS', '1', 'User')
```

### For Command Prompt:
```cmd
set EAS_NO_VCS=1
eas build --platform android --profile production
```

**Note:** Using `EAS_NO_VCS=1` means EAS won't track your project's Git history, which may cause issues with build caching and updates.

## Solution 3: Initialize Git in Your Project

If Git is installed but not initialized in your project:

```powershell
# Navigate to your project
cd C:\Users\kc\Desktop\RSH-main

# Initialize Git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit"

# Now try building
eas build --platform android --profile production
```

## Recommended Approach

**Best practice:** Install Git properly and initialize your project with Git. This gives you:
- Version control for your code
- Better build caching with EAS
- Ability to track changes
- Professional development workflow

## Quick Fix (Temporary)

If you need to build immediately without installing Git:

```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

Then install Git properly for future builds.



