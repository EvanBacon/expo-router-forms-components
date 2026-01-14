---
name: upgrading-expo-sdk
description: Guidelines for upgrading Expo SDK versions and fixing dependency issues
---

## Quick Upgrade

Upgrade to the latest Expo SDK:

```bash
npx expo install expo@latest
```

Then fix all dependencies to be compatible with the new SDK:

```bash
npx expo install --fix
```

## Step-by-Step Upgrade Process

1. **Check current SDK version**

   ```bash
   npx expo --version
   ```

2. **Review release notes** for the target SDK version at https://expo.dev/changelog

3. **Upgrade Expo and dependencies**

   ```bash
   npx expo install expo@^54
   npx expo install --fix
   ```

4. **Run diagnostics**

   ```bash
   npx expo-doctor
   ```

5. **Clear caches and reinstall**
   ```bash
   npx expo start --clear
   rm -rf node_modules .expo
   ```
6. Reinstall dependencies

## Housekeeping

- If using Expo SDK 54 or later, ensure react-native-worklets is installed — this is required for react-native-reanimated to work.
- Delete sdkVersion from `app.json` to let Expo manage it automatically
- Remove implicit packages from `package.json`: `@babel/core`, `babel-preset-expo`, `expo-constants`.
- If the babel.config.js only contains 'babel-preset-expo', delete the file entirely
- If the metro.config.js only contains expo defaults, delete the file entirely

## Diagnostics

Run expo-doctor to identify issues:

```bash
npx expo-doctor
```

This checks for:

- Incompatible dependency versions
- Deprecated packages
- Configuration issues
- Native module conflicts

## Common Upgrade Issues

### Deprecated Packages

| Old Package          | Replacement                                          |
| -------------------- | ---------------------------------------------------- |
| `expo-av`            | `expo-audio` and `expo-video`                        |
| `expo-permissions`   | Individual package permission APIs                   |
| `@expo/vector-icons` | `expo-symbols` (for SF Symbols)                      |
| `AsyncStorage`       | `expo-sqlite/localStorage/install`                   |
| `expo-app-loading`   | `expo-splash-screen`                                 |
| expo-linear-gradient | experimental_backgroundImage + CSS gradients in View |

### Breaking Changes Checklist

- Check for removed APIs in release notes
- Update import paths for moved modules
- Review native module changes requiring prebuild
- Test all camera, audio, and video features
- Verify navigation still works correctly

## Prebuild for Native Changes

If upgrading requires native changes:

```bash
npx expo prebuild --clean
```

This regenerates the `ios` and `android` directories.

## EAS Build After Upgrade

Update your EAS build:

```bash
eas build --platform ios
eas build --platform android
```

## Troubleshooting

### Metro Cache Issues

```bash
npx expo start --clear
```

### Node Modules Issues

```bash
rm -rf node_modules
npm install
npx expo install --fix
```

### Pods Issues (iOS)

```bash
cd ios && pod install --repo-update && cd ..
```

### Gradle Issues (Android)

```bash
cd android && ./gradlew clean && cd ..
```

## Checking Compatibility

Before upgrading, check if your dependencies support the new SDK:

```bash
npx expo install --check
```

This shows which packages need updates without making changes.

## Using Expo Canary

> Canary releases provide early access to upcoming SDK features but they are unstable and do not run in Expo Go.

To try the latest canary SDK:

```bash
npx expo install expo@canary
npx expo install --fix
```

Build a custom dev client.

## Removing patches

Check if there are any outdated patches in the `patches/` directory. Remove them if they are no longer needed.

## Postcss

- autoprefixer isn't needed in SDK 53 and later.
- use postcss.config.mjs in SDK 53 and later.

## Metro

Remove redundant metro config options:

- resolver.unstable_enablePackageExports is enabled by default in SDK 53 and later.
- `experimentalImportSupport` is enabled by default in SDK 54.
- `EXPO_USE_FAST_RESOLVER=1` is removed in SDK 54 and later.
