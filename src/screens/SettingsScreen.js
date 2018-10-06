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
import * as firebase from 'firebase';

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
        <Headline>Settings</Headline>
        <Divider />
        <Divider />
        <Title>Privacy</Title>
        <Subheading>Who can see me?</Subheading>
        <Paragraph>You're visible to nearby Flockers only while you're using Flock.</Paragraph>
        <RadioButton.Group
          value={this.state.profileVisibility}
          onValueChange={profileVisibility => this.setState({ profileVisibility })}
        >
          <View>
            <Text>Everyone</Text>
            <RadioButton value="everyone" />
          </View>
          <View>
            <Text>Friends of friends</Text>
            <RadioButton value="friends_of_friends" />
          </View>
        </RadioButton.Group>
        <Button onPress={this._handleSignOutAsync}>Sign out</Button>
      </Surface>
    );
  }
}
