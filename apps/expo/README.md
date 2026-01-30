# Iterate Expo App

This is the React Native mobile app for Iterate, built with Expo.

## Development

```bash
# Start the development server
bun start

# Run on iOS simulator
bun ios

# Run on Android emulator
bun android
```

## Building

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Features

- Cross-platform (iOS/Android)
- Shared codebase with web app
- Tamagui UI components
- Jotai state management
- React Navigation
