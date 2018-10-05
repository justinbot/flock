import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as firebase from 'firebase';

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    // Navigated based on user log in status
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        console.log('Not logged in!');
        this.props.navigation.navigate('Auth');
      } else {
        console.log('Already logged in!');
        this.props.navigation.navigate('App');
      }
    });
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}
