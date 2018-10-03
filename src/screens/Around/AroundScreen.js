import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import TabBarIcon from 'Components/TabBarIcon';


export default class EventListScreen extends React.Component {
  static navigationOptions = {
    title: 'Around me',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'users'} focused={focused} tintColor={tintColor} />
    ),
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Users around me</Text>
      </View>
    );
  }
}
