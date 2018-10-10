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
      userProfile: this.props.navigation.getParam('userProfile'),
    };
  }

  render() {
    const { navigation } = this.props;

    return (
      <Surface style={{ flex: 1, alignItems: 'center' }}>
        <Headline>Profile</Headline>
        <Image
          style={[{ width: 200, height: 200 }, CommonStyles.avatarImage]}
          source={{ uri: this.state.userProfile.get('avatar_url')}}
        />
        <Headline>{this.state.userProfile.get('display_name')}</Headline>
        <Paragraph>{this.state.userProfile.get('details')}</Paragraph>
      </Surface>
    );
  }
}
