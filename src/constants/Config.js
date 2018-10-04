import { Constants } from 'expo';


// Set configuration based on release channel
// See: https://docs.expo.io/versions/latest/guides/release-channels.html
let releaseChannel = Constants.manifest.releaseChannel;

if (releaseChannel === undefined) {
  // Development configuration
  var config = {
    firebaseConfig: {
      apiKey: '<FIREBASE-API-KEY>',
      authDomain: '<FIREBASE-AUTH-DOMAIN>',
      databaseURL: '<FIREBASE-DATABASE-URL>',
      projectId: '<FIREBASE-PROJECT-ID>',
      storageBucket: '<FIREBASE-STORAGE-BUCKET>',
      messagingSenderId: '<FIREBASE-MESSAGING-SENDER-ID>'
    }
  };

} else if (releaseChannel === 'staging') {
  // TODO Staging configuration

} else if (releaseChannel === 'prod') {
  // TODO Production configuration

}

export default config;
