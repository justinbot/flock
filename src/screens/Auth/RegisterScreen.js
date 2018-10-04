import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
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
    };
  }

  _handleRegisterAsync = async () => {
    // TODO: reduxify

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(() => {
        // TODO: Log to error reporting
        console.warn(error);
      })
      .then(() => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            console.log('Email and password registration and login successful!');
            this.props.navigation.navigate('App');
          })
          .catch(error => {
            let errorCode = error.code;
            let errorMessage = 'Sign up failed: ' + error.message;

            // TODO
            if (errorCode === 'auth/email-already-in-use') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/invalid-email') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/operation-not-allowed') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/weak-password') {
              errorMessage = error.message;
            }

            alert(errorMessage);
          });
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Sign up</Text>
        <TextInput
          label='Email'
          value={this.state.email}
          textContentType='emailAddress'
          mode='outlined'
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          label='Password'
          value={this.state.password}
          secureTextEntry
          textContentType='password'
          mode='outlined'
          onChangeText={password => this.setState({ password })}
        />
        <Button raised onPress={this._handleRegisterAsync}>Sign up for Flock</Button>
      </View>
    );
  }
}
