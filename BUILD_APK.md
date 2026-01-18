# How to Build APK (Not AAB)

## ⚠️ Important: AAB vs APK

- **AAB (Android App Bundle)**: For Google Play Store publishing only - **CANNOT be installed directly**
- **APK (Android Package)**: Can be installed directly on any Android device ✅

## Build APK Command

Use the **preview** profile to get an APK:

```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

Or for production APK:

```powershell
$env:EAS_NO_VCS=1
eas build --platform android --profile production
```

## Verify You're Getting APK

After the build completes, check the build artifact:
- ✅ **APK** = You can download and install directly
- ❌ **AAB** = Only for Play Store, cannot install directly

## If You Still Get AAB

1. Make sure you're using the correct profile:
   ```powershell
   eas build --platform android --profile preview
   ```

2. Check your `eas.json` file - it should have:
   ```json
   "android": {
     "buildType": "apk"
   }
   ```

3. If you still get AAB, explicitly specify:
   ```powershell
   eas build --platform android --profile preview --local
   ```

## Download and Install APK

Once you have the APK:

1. **Download** the APK from the Expo dashboard
2. **Transfer** to your Android device (via USB, email, or cloud)
3. **Enable** "Install from Unknown Sources" in Android settings
4. **Tap** the APK file to install

## Quick Reference

```powershell
# Build APK for testing
$env:EAS_NO_VCS=1
eas build --platform android --profile preview

# Build APK for production
$env:EAS_NO_VCS=1
eas build --platform android --profile production
```

**Note:** The `$env:EAS_NO_VCS=1` is only needed if you don't have Git installed.

