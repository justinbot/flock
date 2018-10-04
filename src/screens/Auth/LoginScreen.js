import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import * as firebase from 'firebase';


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
    };
  }

  _handleLoginAsync = async () => {
    // TODO: reduxify

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(() => {
        // TODO: Log to error reporting
        console.warn(error);
      })
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            console.log('Email and password login successful!');
            this.props.navigation.navigate('App');
          })
          .catch(error => {
            let errorCode = error.code;
            let errorMessage = 'Login failed: ' + error.message;

            if (errorCode === 'auth/invalid-email') {
              errorMessage = 'Invalid email or password.';
            } else if (errorCode === 'auth/user-disabled') {
              errorMessage = 'Account disabled.';
            } else if (errorCode === 'auth/user-not-found') {
              errorMessage = 'Invalid email or password.';
            } else if (errorCode === 'auth/wrong-password') {
              errorMessage = 'Invalid email or password.';
            }

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
          label='Email'
          value={this.state.email}
          textContentType='emailAddress'
          autoFocus
          returnKeyType='next'
          mode='outlined'
          onChangeText={email => {this.setState({ email, errorMessage: '' });}}
          error={this.state.errorMessage}
        />
        <HelperText
          type='error'
          visible={this.state.errorMessage}
        >
          {this.state.errorMessage}
        </HelperText>
        <TextInput
          label='Password'
          value={this.state.password}
          secureTextEntry
          textContentType='password'
          returnKeyType='done'
          mode='outlined'
          onChangeText={password => this.setState({ password, errorMessage: '' })}
          error={this.state.errorMessage}
        />
        <Button mode='contained' onPress={this._handleLoginAsync}>Log in</Button>
        <Text>Forgot your password? TODO</Text>
        <Text>
          Don't have an account? <Text style={{ fontWeight: 'bold' }} onPress={() => navigate('Register')}>Sign up.</Text>
        </Text>
      </View>
    );
  }
}
