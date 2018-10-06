import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import firebase from '@firebase/app';
import 'firebase/auth';

export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Log in',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      busy: false,
    };
  }

  _handleLoginAsync = async () => {
    // TODO: reduxify
    this.setState({ busy: true });

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(error => {
        // TODO: Log to error reporting
        console.warn(error);
      })
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            console.log('Email and password login successful!');
            this.setState({ busy: false });
            this.props.navigation.navigate('AppStack');
          })
          .catch(error => {
            let errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode === 'auth/invalid-email') {
              errorMessage = 'Invalid email or password.';
            } else if (errorCode === 'auth/user-disabled') {
              errorMessage = 'Account disabled.';
            } else if (errorCode === 'auth/user-not-found') {
              errorMessage = 'Invalid email or password.';
            } else if (errorCode === 'auth/wrong-password') {
              errorMessage = 'Invalid email or password.';
            } else {
              errorMessage = 'An error occured during login.';
              // TODO: Log to error reporting
              console.warn(error);
            }

            this.setState({ busy: false });
            this.setState({ errorMessage });
          });
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Sign in to Flock</Text>
        <TextInput
          label="Email"
          value={this.state.email}
          textContentType="emailAddress"
          autoFocus
          returnKeyType="next"
          mode="outlined"
          onChangeText={email => {
            this.setState({ email, errorMessage: '' });
          }}
          error={this.state.errorMessage}
        />
        <HelperText type="error" visible={this.state.errorMessage}>
          {this.state.errorMessage}
        </HelperText>
        <TextInput
          label="Password"
          value={this.state.password}
          secureTextEntry
          textContentType="password"
          returnKeyType="done"
          mode="outlined"
          onChangeText={password => this.setState({ password, errorMessage: '' })}
          error={this.state.errorMessage}
        />
        <Button mode="contained" loading={this.state.busy} onPress={this._handleLoginAsync}>
          Log in
        </Button>
        <Text>Forgot your password? TODO</Text>
        <Text>
          Don't have an account?{' '}
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={() => navigate('Register')}>
            Sign up.
          </Text>
        </Text>
      </View>
    );
  }
}
