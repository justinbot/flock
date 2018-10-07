import React from 'react';
import { Headline, Surface, Text } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Nearby Flocker',
  };

  constructor(props) {
    super(props);
    this.state = {
      displayName: null,
      details: null,
      avatarUrl: null,
    };
  }

  componentDidMount() {
    // Get info for the specified user
    const userId = this.props.navigation.getParam('userId');

    firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(userProfile => {
        // TODO handle error
        this.setState({
          displayName: userProfile.get('display_name'),
          details: userProfile.get('details'),
          avatarUrl: userProfile.get('avatar_url'),
        });
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <Surface style={{ flex: 1 }}>
        <Headline>Profile</Headline>
        {/*TODO description*/}
        <Text>Display Name: {this.state.displayName}</Text>
        <Text>Details: {this.state.details}</Text>
        <Text>Avatar URL: {this.state.avatarUrl}</Text>
      </Surface>
    );
  }
}
