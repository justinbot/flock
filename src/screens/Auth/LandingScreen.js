import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';


export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Flock',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Logo</Text>
        <Text>Log in</Text>
        <Text>Sign up</Text>
      </View>
    );
  }
}