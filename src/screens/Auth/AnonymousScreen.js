import React from 'react';
import { View } from 'react-native';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class AnonymousScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      busy: false,
    };
  }

  componentDidMount() {
    this._handleRegisterAsync();
  }

  _handleRegisterAsync = async () => {
    // TODO: reduxify
    this.setState({ busy: true });

    firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        // TODO: Navigate to onboarding for profile setup
        this.props.navigation.navigate('AppStack');
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
          errorMessage = 'Email is invalid or already taken.';
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Email is invalid or already taken.';
        } else if (errorCode === 'auth/weak-password') {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occured during registration.';
          // TODO: Log to error reporting
          console.warn(error);
        }

        this.setState({ busy: false, errorMessage });
      });
  };

  render() {
    const navigation = this.props.navigation;

    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }
}
