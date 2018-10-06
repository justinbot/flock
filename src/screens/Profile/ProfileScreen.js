import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, Surface, Text, Title } from 'react-native-paper';
import * as firebase from 'firebase';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigate } = this.props.navigation;
    let currentUser = firebase.auth().currentUser;

    return (
      <Surface style={CommonStyles.container}>
        <Headline>Profile</Headline>
        {/*TODO edit button*/}
        {/*TODO settings button*/}
        <Text>Display Name: {currentUser.displayName}</Text>
        <Text>Photo URL: {currentUser.photoURL}</Text>
        <Text>Email: {currentUser.email}</Text>
        <Text>Email verified: {currentUser.emailVerified.toString()}</Text>
        <Text>Created: {currentUser.metadata.creationTime}</Text>
        <Text>Last sign in: {currentUser.metadata.lastSignInTime}</Text>
        <Button onPress={() => navigate('Settings')}>Settings</Button>
      </Surface>
    );
  }
}
