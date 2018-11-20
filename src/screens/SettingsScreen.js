import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Constants } from 'expo';
import {
  Appbar,
  Button,
  Card,
  Divider,
  Paragraph,
  Snackbar,
  Subheading,
  Surface,
  Text,
  Title,
} from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  _onBack = () => {
    // Keyboard.dismiss();
    // TODO Loader
    this.props.navigation.goBack();
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top" delay>
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => this._onBack()} />
              <Appbar.Content title="Edit profile" />
            </Appbar.Header>
          </View>
        </Transition>
        <ScrollView>
          <Surface style={[CommonStyles.container, { elevation: 2 }]}>
            <Title style={CommonStyles.containerItem}>Privacy</Title>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <Title>Who can see me?</Title>
                <Paragraph>
                  You're visible to nearby Flockers only while you're using Flock.
                </Paragraph>
              </Card.Content>
            </Card>
            <Title style={CommonStyles.containerItem}>Notifications</Title>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <Paragraph>TODO</Paragraph>
              </Card.Content>
            </Card>
            <Button
              style={CommonStyles.containerItem}
              mode="outlined"
              onPress={this._handleSignOutAsync}>
              <Text style={{ color: theme.colors.accent }}>Sign out</Text>
            </Button>
          </Surface>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
            <Text style={{ color: theme.colors.disabled }}>
              Flock v{Constants.manifest.version}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
