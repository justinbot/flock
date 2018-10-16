import React from 'react';
import { View } from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  Paragraph,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class RegisterScreen extends React.Component {
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
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
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

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/*<Transition appear="top" disappear="top">*/}
        {/*<View>*/}
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Sign up" />
        </Appbar.Header>
        {/*</View>*/}
        {/*</Transition>*/}
        <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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
              onPress={this._handleRegisterAsync}>
              <Subheading style={{ color: '#ffffff' }}>Sign up for Flock</Subheading>
            </Button>
            <Paragraph style={CommonStyles.containerItem}>
              Already have an account?{' '}
              <Text
                style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
                onPress={() => navigation.navigate('Login')}>
                Log in.
              </Text>
            </Paragraph>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
