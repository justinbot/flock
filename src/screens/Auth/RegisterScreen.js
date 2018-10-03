import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';


export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Sign up',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Sign up</Text>
      </View>
    );
  }
}
