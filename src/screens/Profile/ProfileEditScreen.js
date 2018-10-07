import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  Headline,
  Paragraph,
  RadioButton,
  Subheading,
  Surface,
  Text,
  Title,
} from 'react-native-paper';

import firebase from 'expo-firebase-app';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Edit Profile',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _handleSaveAsync = async () => {
    // TODO Save changes
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Surface style={{ flex: 1 }}>
        <Headline>TODO</Headline>
        <Divider />
      </Surface>
    );
  }
}
