# Build APK Now - Step by Step

## Quick Build Command

Run this in PowerShell (in your project directory):

```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

## Step-by-Step Instructions

### 1. Open PowerShell
Navigate to your project:
```powershell
cd C:\Users\kc\Desktop\RSH-main
```

### 2. Login to Expo (if not already logged in)
```powershell
eas login
```
Enter your Expo account email and password.

### 3. Build the APK
```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

### 4. Wait for Build
- Build will start in the cloud
- Takes about 10-20 minutes
- You'll see progress updates
- You'll get a link to track the build

### 5. Download APK
Once build completes:
- Click the link provided, OR
- Go to: https://expo.dev/accounts/[your-account]/projects/rhs-archaid/builds
- Click "Download" on the completed build
- You'll get an APK file

## What You'll See

```
✔ Build started
✔ Build ID: abc123...
📱 Build URL: https://expo.dev/accounts/.../builds/abc123
```

## Troubleshooting

### If "not logged in" error:
```powershell
eas login
```

### If Git error persists:
Make sure you include `$env:EAS_NO_VCS=1` before the build command

### If build fails:
Check the build logs in the Expo dashboard for error details

## Alternative: One-Line Command

```powershell
$env:EAS_NO_VCS=1; eas build --platform android --profile preview
```

## After Download

1. Transfer APK to your Android device
2. Enable "Install from Unknown Sources" in Android settings
3. Tap the APK file to install

---

**Note:** The build happens on Expo's servers, so you need to be logged in with your Expo account.

