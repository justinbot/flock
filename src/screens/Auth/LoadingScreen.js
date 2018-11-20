import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';
import 'expo-firebase-firestore';

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    // Navigated based on user log in status
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        // Not logged in
        this.props.navigation.navigate('AuthStack');
      } else {
        // Already logged in
        // Check if user has profile or needs onboarding.
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(userProfile => {
            if (userProfile.exists) {
              this.props.navigation.navigate('AppStack');
            } else {
              // User missing profile
              this.props.navigation.navigate('OnboardStack');
            }
          })
          .catch(err => {
            // TODO Couldn't get user profile
            // TODO log to error reporting
            console.log(err);
            this.props.navigation.navigate('AppStack');
          });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}
