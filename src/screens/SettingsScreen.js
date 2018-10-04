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
        <Button onPress={this._handleSignOutAsync}>Sign out</Button>
      </View>
    );
  }
}
