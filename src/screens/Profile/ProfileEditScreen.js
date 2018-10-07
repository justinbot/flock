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
  TextInput,
  Title,
} from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Edit Profile',
  };

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.state = {
      currentUser: firebase.auth().currentUser,
      displayName: null,
      details: null,
      avatarUrl: null,
    };
  }

  componentDidMount() {
    this.ref
      .doc(this.state.currentUser.uid)
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

  _handleSaveAsync = async () => {
    this.ref.doc(this.state.currentUser.uid).set({
      display_name: this.state.displayName,
      details: this.state.details,
      avatar_url: this.state.avatarUrl,
    });
    // TODO Reload
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Surface style={{ flex: 1 }}>
        <Headline>TODO</Headline>
        <Divider />
        <TextInput
          label="Name"
          mode="outlined"
          maxLength={20}
          value={this.state.displayName}
          onChangeText={displayName => this.setState({ displayName })}
        />
        <TextInput
          label="About you"
          placeholder="Add some details"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={this.state.details}
          onChangeText={details => this.setState({ details })}
        />
        <Button mode="contained" onPress={this._handleSaveAsync}>
          Save
        </Button>
      </Surface>
    );
  }
}
