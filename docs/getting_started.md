## Getting Started
Prerequisites:
* Node.js 8.12.0
* Java 1.8.0
* Android SDK supporting API level 27

1. Set up your Firebase back-end and enable Authentication, Cloud Firestore, and Cloud Storage.
2. Get your `google-services.json` file (see: [Add Firebase to Your Android Project](https://firebase.google.com/docs/android/setup)) and put it in the `flock/android/app` directory.
3. `npm install` to install all dependencies required to develop Flock.
4. `npm run start` to start JavaScript bundler and Expo DevTools.
5. `npm run android` to build the app and install it on an emulator or connected Android device. Note that you can simply reload the app to see non-native code changes.
