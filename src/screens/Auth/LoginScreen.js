import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';


export default class LandingScreen extends React.Component {
  static navigationOptions = {
    title: 'Log in',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Button raised onPress={() => navigate('App')}>Log in</Button>
      </View>
    );
  }
}
