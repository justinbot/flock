import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import TabBarIcon from 'Components/TabBarIcon';


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'settings'} focused={focused} tintColor={tintColor} />
    ),
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Settings</Text>
        <Button onPress={() => navigate('Auth')}>Sign out</Button>
      </View>
    );
  }
}
