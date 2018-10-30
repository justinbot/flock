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
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Surface style={{ flex: 1 }}>
        <Title>Friends</Title>
      </Surface>
    );
  }
}
