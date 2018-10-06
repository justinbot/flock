import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Flock',
    header: null,
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Text>Logo</Text>
        <Button mode="contained" onPress={() => navigate('Register')}>
          Sign up
        </Button>
        <Button mode="outline" onPress={() => navigate('Login')}>
          Log in
        </Button>
      </View>
    );
  }
}
