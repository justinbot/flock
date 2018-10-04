import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as firebase from 'firebase';


export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the user login token from storage then navigate to app or auth
  _bootstrapAsync = async () => {
    // Listen for auth
    // firebase.auth().onAuthStateChanged(this._handleAuthStateChanged);

    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    this.props.navigation.navigate('Auth');
  };

  _handleAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({message}) {
        alert(message);
      }
    }
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}
