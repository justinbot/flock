import React from 'react';
import { Image } from 'react-native';
import { Headline, Surface, Text } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Nearby Flocker',
  };

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.state = {
      userId: this.props.navigation.getParam('userId'),
      displayName: null,
      details: null,
      avatarUrl: null,
    };
  }

  componentDidMount() {
    // Get info for the specified user
    this.ref.doc(this.state.userId).onSnapshot(userProfile => {
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
        <Image
          style={[{ width: 300, height: 300 }, CommonStyles.avatarImage]}
          source={{ uri: this.state.avatarUrl }}
        />
        {/*TODO description*/}
        <Text>Display Name: {this.state.displayName}</Text>
        <Text>Details: {this.state.details}</Text>
        <Text>Avatar URL: {this.state.avatarUrl}</Text>
      </Surface>
    );
  }
}
