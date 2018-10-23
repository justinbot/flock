import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Divider, Paragraph, Snackbar, Surface, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Transition } from 'react-navigation-fluid-transitions';

import firebase from 'expo-firebase-app';
import 'expo-firebase-auth';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        userProfile => {
          if (userProfile.exists) {
            this.setState({ userProfile });
          } else {
            this.setState({ userProfile: null, snackbarMessage: "User doesn't have a profile" });
            // TODO User missing profile, could be first time
          }
        },
        err => {
          // TODO log to error reporting
          console.log(err);
        }
      );
  }

  _userProfileContent = () => {
    if (this.state.userProfile) {
      return (
        <Animatable.View animation="fadeIn" duration={300} useNativeDriver>
          <View style={CommonStyles.container}>
            <View style={{ margin: theme.marginHorizontal }}>
              <View
                style={[
                  {
                    flex: 1,
                    aspectRatio: 1,
                    padding: theme.marginHorizontal / 2,
                    borderRadius: 28,
                    backgroundColor: theme.colors.background,
                  },
                ]}>
                <Transition shared={'avatarImage'}>
                  <Image
                    source={{ uri: this.state.userProfile.get('avatar_url') }}
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                </Transition>
              </View>
            </View>
            <View style={CommonStyles.containerItem}>
              <Transition shared={'details'}>
                <Paragraph style={{ marginVertical: theme.marginVertical }}>
                  {this.state.userProfile.get('details')}
                </Paragraph>
              </Transition>
            </View>
          </View>
        </Animatable.View>
      );
    } else {
      return (
        <View style={{ flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }} statusBarHeight={0}>
          <Appbar.Content
            title={this.state.userProfile && this.state.userProfile.get('display_name')}
          />
          <Appbar.Action
            color={theme.colors.primary}
            icon={({ size, color }) => <Icon.Feather name="edit" size={size} color={color} />}
            onPress={() => navigate('ProfileEdit')}
          />
          <Appbar.Action
            color={theme.colors.primary}
            icon={({ size, color }) => <Icon.Feather name="settings" size={size} color={color} />}
            onPress={() => navigate('Settings')}
          />
        </Appbar.Header>
        <ScrollView>
          <Surface style={{ elevation: 2, paddingBottom: theme.marginVertical }}>
            {this._userProfileContent()}
          </Surface>
          <View style={CommonStyles.container} />
        </ScrollView>
        <Snackbar
          visible={this.state.snackbarMessage != null}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({ snackbarMessage: null })}>
          {this.state.snackbarMessage}
        </Snackbar>
      </View>
    );
  }
}
