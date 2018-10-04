import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
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

            // TODO
            if (errorCode === 'auth/invalid-email') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/user-disabled') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/user-not-found') {
              errorMessage = error.message;
            } else if (errorCode === 'auth/wrong-password') {
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
        <Button raised onPress={this._handleLoginAsync}>Log in</Button>
      </View>
    );
  }
}
