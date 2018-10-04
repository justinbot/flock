import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';


export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Flock',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Logo</Text>
        <Button mode='contained' onPress={() => navigate('Register')}>Sign up</Button>
        <Button onPress={() => navigate('Login')}>Log in</Button>
      </View>
    );
  }
}
