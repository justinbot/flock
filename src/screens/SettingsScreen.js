import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Headline, Surface, Text, Title } from 'react-native-paper';
import * as firebase from 'firebase';

import CommonStyles from 'src/styles/CommonStyles';
import TabBarIcon from 'src/components/TabBarIcon';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'settings'} focused={focused} tintColor={tintColor} />
    ),
  };

  _handleSignOutAsync = async () => {
    // TODO: reduxify
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Auth');
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Surface style={CommonStyles.container}>
        <Headline>Settings</Headline>
        <Divider />
        <Title>Privacy</Title>
        <Text>Display Name: {firebase.auth().currentUser.displayName}</Text>
        <Text>Photo URL: {firebase.auth().currentUser.photoURL}</Text>
        <Text>Email: {firebase.auth().currentUser.email}</Text>
        <Text>Email verified: {firebase.auth().currentUser.emailVerified.toString()}</Text>
        <Text>Created: {firebase.auth().currentUser.metadata.creationTime}</Text>
        <Text>Last sign in: {firebase.auth().currentUser.metadata.lastSignInTime}</Text>
        <Button onPress={this._handleSignOutAsync}>Sign out</Button>
      </Surface>
    );
  }
}
