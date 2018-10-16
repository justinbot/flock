import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Button, HelperText, Paragraph, Surface, Text, TextInput } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import CommonStyles from 'src/styles/CommonStyles';
import theme from 'src/constants/Theme';

export default class LandingScreen extends React.Component {
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
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log('Email and password login successful!');
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

        this.setState({ busy: false, errorMessage });
      });
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top">
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
              <Appbar.Content title="Log in" />
            </Appbar.Header>
          </View>
        </Transition>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={CommonStyles.containerItem}
              label="Email"
              mode="outlined"
              textContentType="emailAddress"
              autoFocus
              returnKeyType="next"
              value={this.state.email}
              onChangeText={email => {
                this.setState({ email, errorMessage: '' });
              }}
              error={this.state.errorMessage}
            />
            <HelperText type="error" visible={this.state.errorMessage}>
              {this.state.errorMessage}
            </HelperText>
            <TextInput
              style={CommonStyles.containerItem}
              label="Password"
              mode="outlined"
              textContentType="password"
              secureTextEntry
              returnKeyType="done"
              value={this.state.password}
              onChangeText={password => this.setState({ password, errorMessage: '' })}
              error={this.state.errorMessage}
            />
            <Button
              style={CommonStyles.containerItem}
              mode="contained"
              loading={this.state.busy}
              onPress={this._handleLoginAsync}>
              Log in
            </Button>
            <View style={CommonStyles.containerItem}>
              <Paragraph>Forgot your password? TODO</Paragraph>
              <Paragraph>
                Don't have an account?{' '}
                <Text
                  style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
                  onPress={() => navigation.navigate('Register')}>
                  Sign up.
                </Text>
              </Paragraph>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
