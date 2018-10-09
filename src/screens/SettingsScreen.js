import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Constants } from 'expo';
import {
  Button,
  Card,
  Divider,
  Paragraph,
  Surface,
  Text,
  Title,
} from 'react-native-paper';
import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = {
      profileVisbility: 'everyone',
    };
  }

  _handleSignOutAsync = async () => {
    // TODO: reduxify
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('AuthStack');
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Surface style={{ flex: 1 }}>
        <Title>Privacy</Title>
        <Card>
          <Card.Content>
            <Title>Who can see me?</Title>
            <Paragraph>You're visible to nearby Flockers only while you're using Flock.</Paragraph>
          </Card.Content>
        </Card>
        <Title>Notifications</Title>
        <Card>
          <Card.Content>
            <Paragraph>TODO</Paragraph>
          </Card.Content>
        </Card>
        <Button mode="outlined" onPress={this._handleSignOutAsync}>Sign out</Button>
        <Divider />
        <Text>Flock v{Constants.manifest.version}</Text>
      </Surface>
    );
  }
}
