# flock
Flock is a hyper-local social media app which uses location and mutual friends to help connect people.

## Getting Started
Prerequisites:
* Node.js 8.12.0
* Java 1.8.0
* Android SDK supporting API level 27

1. `npm install` to install all dependencies required to develop Flock.
2. `npm run start` to start JavaScript bundler and Expo DevTools.
3. `npm run android` to build the app and install it on an emulator or connected Android device.

## Building for release
__Android__

1. From inside the `android` directory, run `./gradlew assembleRelease`.

To sign the built APK using the debug keystore
1. Find `app-prodMinSdk-prodKernel-release-unsigned.apk` within the `app/build` directory.
2. Run `jarsigner -verbose -keystore ~/.android/debug.keystore app-prodMinSdk-prodKernel-release-unsigned.apk androiddebugkey`.
