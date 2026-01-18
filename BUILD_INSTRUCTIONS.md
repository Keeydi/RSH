# Building APK for RHS ArchAID

This guide will help you build an APK file for your React Native Expo app.

## Prerequisites

1. **Node.js** (v18 or later)
2. **Expo CLI** - Install globally:
   ```bash
   npm install -g expo-cli eas-cli
   ```
3. **Expo Account** - Sign up at https://expo.dev (free)

## Method 1: Using EAS Build (Recommended)

EAS Build is the modern way to build Expo apps. It builds your app in the cloud.

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

### Step 3: Configure EAS Build

```bash
eas build:configure
```

This will create/update the `eas.json` file (already created for you).

### Step 4: Build APK

**For Preview/Testing (APK):**
```bash
npm run build:android
```

Or directly:
```bash
eas build --platform android --profile preview
```

**For Production (APK):**
```bash
npm run build:android:prod
```

Or directly:
```bash
eas build --platform android --profile production
```

### Step 5: Download APK

1. The build will start in the cloud
2. You'll get a link to track the build progress
3. Once complete, download the APK from the Expo dashboard or use:
   ```bash
   eas build:list
   ```

## Method 2: Local Build (Advanced)

If you want to build locally, you need Android Studio and Android SDK.

### Step 1: Install Android Studio

Download from: https://developer.android.com/studio

### Step 2: Set up Android Environment

1. Install Android SDK (API 33 or higher)
2. Set environment variables:
   - `ANDROID_HOME` - Path to Android SDK
   - Add to PATH: `$ANDROID_HOME/platform-tools` and `$ANDROID_HOME/tools`

### Step 3: Generate Native Code

```bash
npx expo prebuild --platform android
```

### Step 4: Build APK Locally

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Method 3: Using Expo Development Build

For development/testing:

```bash
npx expo run:android
```

This creates a development build that you can install on your device.

## Important Notes

1. **Package Name**: The Android package name is set to `com.rhs.archaid` in `app.json`
2. **Version**: Update `version` and `versionCode` in `app.json` before each release
3. **Signing**: For production builds, you'll need to set up app signing (EAS can handle this automatically)
4. **Permissions**: All required permissions are already configured in `app.json`

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify your Expo account is logged in: `eas whoami`
- Check build logs in Expo dashboard

### APK Not Installing
- Make sure "Install from Unknown Sources" is enabled on your Android device
- Check that the APK is for the correct architecture (arm64-v8a, armeabi-v7a, x86, x86_64)

### Need Help?
- Expo Docs: https://docs.expo.dev/build/introduction/
- EAS Build Docs: https://docs.expo.dev/build/introduction/

## Quick Start (EAS Build)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Build APK
eas build --platform android --profile preview

# 4. Wait for build to complete and download APK
```

The APK will be available in your Expo dashboard at: https://expo.dev/accounts/[your-account]/projects/rhs-archaid/builds



