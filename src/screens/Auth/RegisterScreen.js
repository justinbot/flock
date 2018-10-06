import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import * as firebase from 'firebase';

export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Sign up',
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

  _handleRegisterAsync = async () => {
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
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            console.log('Email and password registration and login successful!');
            // TODO: Navigate to onboarding for profile setup
            this.setState({ busy: false });
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

            this.setState({ busy: false });
            this.setState({ errorMessage });
          });
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Sign up</Text>
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
        <Button mode="contained" loading={this.state.busy} onPress={this._handleRegisterAsync}>
          Sign up for Flock
        </Button>
        <Text>
          Already have an account?{' '}
          <Text
            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
            onPress={() => navigate('Login')}>
            Log in.
          </Text>
        </Text>
      </View>
    );
  }
}
