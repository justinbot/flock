import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Headline, Paragraph, Surface, Text, Title } from 'react-native-paper';
import { Icon } from 'expo';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      displayName: null,
      details: null,
      avatarPath: null,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.state.currentUser.uid)
      .onSnapshot(userProfile => {
        console.log(userProfile);
        // TODO handle error
        this.setState({
          displayName: userProfile.get('display_name'),
          details: userProfile.get('details'),
          avatarPath: userProfile.get('avatar_path'),
        });
      });
  }

  render() {
    const { navigate } = this.props.navigation;

    let content = <Text>TODO loader</Text>;
    if (this.state.currentUser) {
      content = (
        <View>
          <Text>Display Name: {this.state.displayName}</Text>
          <Text>Details: {this.state.details}</Text>
          <Image
            style={[{ width: 240, height: 240 }, CommonStyles.avatarImage]}
            source={{ uri: this.state.avatarUrl }}
          />
          <Text>Avatar Path: {this.state.avatarPath}</Text>

          <Text>Display Name: {this.state.currentUser.displayName}</Text>
          <Text>Photo URL: {this.state.currentUser.photoURL}</Text>
          <Text>Email: {this.state.currentUser.email}</Text>
          <Text>Email verified: {this.state.currentUser.emailVerified.toString()}</Text>
          <Text>Created: {this.state.currentUser.metadata.creationTime}</Text>
          <Text>Last sign in: {this.state.currentUser.metadata.lastSignInTime}</Text>
        </View>
      );
    }

    return (
      <Surface style={{ flex: 1 }}>
        <Headline>Profile</Headline>
        {/*TODO description*/}
        {content}
        <Button
          icon={({ size, color }) => (
            <Icon.Feather name="edit" width={size} height={size} color={color} />
          )}
          onPress={() => navigate('ProfileEdit')}>
          Edit info
        </Button>
        <Button
          icon={({ size, color }) => (
            <Icon.Feather name="settings" width={size} height={size} color={color} />
          )}
          onPress={() => navigate('Settings')}>
          Settings
        </Button>
      </Surface>
    );
  }
}
