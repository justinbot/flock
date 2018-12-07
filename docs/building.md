## Building an APK

1. From inside the `android` directory, run `./gradlew assembleRelease`. This will take a while, and produce several APKs with different configurations.

To sign the built APK using the debug keystore
1. Find `app-prodMinSdk-prodKernel-release-unsigned.apk` within the `app/build` directory.
2. Run `jarsigner -verbose -keystore ~/.android/debug.keystore app-prodMinSdk-prodKernel-release-unsigned.apk androiddebugkey`.
