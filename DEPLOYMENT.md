# Android Play Store Deployment Guide

This guide explains how to deploy the Camorent Mobile App to Google Play Store using GitHub Actions.

## Prerequisites

### 1. Generate Upload Keystore

If you don't have a keystore yet:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore camorent-upload-key.keystore -alias camorent-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Save the keystore file and passwords securely. You'll need:
- Keystore file (`camorent-upload-key.keystore`)
- Keystore password
- Key alias (e.g., `camorent-key-alias`)
- Key password

### 2. Configure GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions, and add:

1. **KEYSTORE_BASE64**: Base64-encoded keystore file
   ```bash
   # On macOS/Linux:
   base64 -i camorent-upload-key.keystore | pbcopy

   # On Windows (PowerShell):
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("camorent-upload-key.keystore")) | Set-Clipboard
   ```

2. **KEY_ALIAS**: Your keystore key alias (e.g., `camorent-key-alias`)

3. **KEYSTORE_PASSWORD**: Your keystore password

4. **KEY_PASSWORD**: Your key password

## Automated Build Process

The GitHub Actions workflow (`.github/workflows/build-aab.yml`) automatically:

1. ✅ Checks out code
2. ✅ Sets up Node.js 20.18.1 and Java 17
3. ✅ Installs dependencies
4. ✅ Runs TypeScript type checking
5. ✅ Decodes keystore from secrets
6. ✅ Runs `expo prebuild` to generate native Android project
7. ✅ Configures signing credentials
8. ✅ Builds release AAB (Android App Bundle)
9. ✅ Verifies AAB signing
10. ✅ Uploads AAB as artifact

## Triggering a Build

### Automatic (on push to main)
```bash
git add .
git commit -m "Release v1.0.0"
git push origin main
```

### Manual (via GitHub UI)
1. Go to Actions tab in GitHub
2. Select "Build Android AAB" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow" button

## Download & Upload to Play Store

1. **Download AAB from GitHub Actions:**
   - Go to Actions tab → select the workflow run
   - Scroll to "Artifacts" section
   - Download `app-release-aab`

2. **Upload to Play Console:**
   - Go to [Google Play Console](https://play.google.com/console)
   - Select your app
   - Go to "Production" → "Create new release"
   - Upload the `app-release.aab` file
   - Fill in release notes
   - Review and roll out

## Build Configuration

### Version Management
Update in `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId 'com.camorent.customermobileapp'
    versionCode 2        // Increment for each release
    versionName "1.0.1"  // Semantic version
}
```

### Key Features Enabled

✅ **Edge-to-Edge UI** - Modern Android 15+ full-screen experience
✅ **ProGuard** - Code obfuscation and optimization
✅ **Hermes Engine** - Optimized JavaScript engine
✅ **New Architecture** - React Native's new architecture (enabled)
✅ **Proper Signing** - Production keystore signing
✅ **16KB Page Size Support** - Compatible with Android 15+ requirements

### Build Optimizations

The build is configured with:
- JVM heap: 4GB
- Max workers: 2 (prevents OOM in CI)
- ProGuard enabled for code shrinking
- PNG crunching enabled
- Hermes bytecode compilation

## Troubleshooting

### Build Fails with "Out of Memory"
The workflow is already configured with `--max-workers=2` and 4GB heap. If it still fails:
1. Check if dependencies are too large
2. Consider disabling ProGuard temporarily: set `android.enableProguardInReleaseBuilds=false`

### Keystore Decoding Fails
Ensure the base64 encoding doesn't have line breaks:
```bash
base64 -i camorent-upload-key.keystore | tr -d '\n' | pbcopy
```

### TypeScript Errors
Run locally first:
```bash
npx tsc --noEmit --skipLibCheck
```

### Signing Verification Fails
Check that all 4 secrets are set correctly:
- `KEYSTORE_BASE64`
- `KEY_ALIAS`
- `KEYSTORE_PASSWORD`
- `KEY_PASSWORD`

## Local Testing

To build AAB locally:

```bash
# Install dependencies
npm ci

# Run prebuild
npx expo prebuild --platform android --clean

# Copy your keystore
cp /path/to/camorent-upload-key.keystore android/app/

# Add signing config to gradle.properties
echo "CAMORENT_UPLOAD_STORE_FILE=camorent-upload-key.keystore" >> android/gradle.properties
echo "CAMORENT_UPLOAD_KEY_ALIAS=your-key-alias" >> android/gradle.properties
echo "CAMORENT_UPLOAD_STORE_PASSWORD=your-store-password" >> android/gradle.properties
echo "CAMORENT_UPLOAD_KEY_PASSWORD=your-key-password" >> android/gradle.properties

# Build
cd android
./gradlew bundleRelease

# AAB output at: android/app/build/outputs/bundle/release/app-release.aab
```

## Play Store Release Checklist

Before each release:

- [ ] Increment `versionCode` and `versionName` in `build.gradle`
- [ ] Test the app thoroughly on physical devices
- [ ] Update app screenshots if UI changed
- [ ] Prepare release notes (What's New)
- [ ] Verify all secrets are set in GitHub
- [ ] Review and approve GitHub Actions workflow run
- [ ] Download and test the AAB locally before uploading
- [ ] Create internal test release first
- [ ] Promote to production after testing

## Security Notes

⚠️ **Never commit:**
- Keystore files (`.keystore`, `.jks`)
- Passwords or credentials
- `google-services.json` with sensitive keys
- `gradle.properties` with signing credentials

✅ **Always:**
- Use GitHub Secrets for sensitive data
- Keep keystore backup in secure location
- Rotate credentials if compromised
- Use different keystores for debug/release

## Support

For issues with deployment:
1. Check GitHub Actions logs for detailed errors
2. Verify all prerequisites are met
3. Test build locally first
4. Check [Expo documentation](https://docs.expo.dev/) for Android builds
