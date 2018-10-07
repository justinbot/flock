import React from 'react';
import { Headline, Surface, Text } from 'react-native-paper';

import firebase from '@firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    // Get info for the specified user
    const userId = this.props.navigation.getParam('userId');

    firebase.firestore().settings({ timestampsInSnapshots: true });

    firebase
      .firestore()
      .collection('users')
      .doc('UWS9F656WWZCuZhSHbgs')
      .get()
      .then(userProfile => {
        console.log(userProfile);
        this.setState({
          displayName: userProfile.displayName,
          details: userProfile.details,
          avatarUrl: userProfile.avatarUrl,
        });
      })
      .catch(err => {
        // TODO on error
      });
  };

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
