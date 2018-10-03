import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import TabBarIcon from 'Components/TabBarIcon';


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Flock',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'users'} focused={focused} tintColor={tintColor} />
    ),
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Settings</Text>
      </View>
    );
  }
}
