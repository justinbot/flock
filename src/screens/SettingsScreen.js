import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as firebase from 'firebase';

import TabBarIcon from 'Components/TabBarIcon';


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'settings'} focused={focused} tintColor={tintColor} />
    ),
  };

  _handleSignOutAsync = async () => {
    // TODO: reduxify
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate('Auth');
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Settings</Text>
        <Text>Display Name: {firebase.auth().currentUser.displayName}</Text>
        <Text>Photo URL: {firebase.auth().currentUser.photoURL}</Text>
        <Text>Email: {firebase.auth().currentUser.email}</Text>
        <Text>Email verified: {firebase.auth().currentUser.emailVerified}</Text>
        <Text>Created: {firebase.auth().currentUser.metadata.creationTime}</Text>
        <Text>Last sign in: {firebase.auth().currentUser.metadata.lastSignInTime}</Text>
        <Button onPress={this._handleSignOutAsync}>Sign out</Button>
      </View>
    );
  }
}
