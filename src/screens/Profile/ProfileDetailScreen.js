import React from 'react';
import { Image } from 'react-native';
import { Headline, Paragraph, Surface } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Nearby Flocker',
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.navigation.getParam('userId'),
      displayName: null,
      details: null,
      avatarUrl: null,
    };
  }

  componentDidMount() {
    // Get info for the specified user
    firebase
      .firestore()
      .collection('users')
      .doc(this.state.userId)
      .onSnapshot(userProfile => {
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
      <Surface style={{ flex: 1, alignItems: 'center' }}>
        <Headline>Profile</Headline>
        <Image
          style={[{ width: 200, height: 200 }, CommonStyles.avatarImage]}
          source={{ uri: this.state.avatarUrl }}
        />
        <Headline>{this.state.displayName}</Headline>
        <Paragraph>{this.state.details}</Paragraph>
      </Surface>
    );
  }
}
