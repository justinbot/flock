import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import { Button, Divider, Paragraph, Snackbar, Surface, Text } from 'react-native-paper';
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
              <Transition shared={'avatarImage'}>
                <Image
                  source={{ uri: this.state.userProfile.get('avatar_url') }}
                  style={{ flex: 1, aspectRatio: 1, borderRadius: 20 }}
                  resizeMode="cover"
                />
              </Transition>
            </View>
            <View style={CommonStyles.containerItem}>
              <Transition shared={'displayName'}>
                <Text
                  style={{
                    fontFamily: theme.fonts.alternateMedium,
                    fontSize: 28,
                    fontWeight: 'bold',
                  }}>
                  {this.state.userProfile.get('display_name')}
                </Text>
              </Transition>
              <Divider style={{ backgroundColor: theme.colors.secondary, height: 2 }} />
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
        <ScrollView>
          <Surface style={{ elevation: 2, paddingBottom: theme.marginVertical }}>
            {this._userProfileContent()}
          </Surface>
          <View style={CommonStyles.container}>
            <Button
              style={CommonStyles.containerItem}
              mode="outlined"
              icon={({ size, color }) => (
                <Icon.Feather name="edit" width={size} height={size} color={color} />
              )}
              onPress={() => navigate('ProfileEdit')}>
              Edit Profile
            </Button>
            <Button
              style={CommonStyles.containerItem}
              mode="outlined"
              icon={({ size, color }) => (
                <Icon.Feather name="settings" width={size} height={size} color={color} />
              )}
              onPress={() => navigate('Settings')}>
              Settings
            </Button>
          </View>
          <Snackbar
            visible={this.state.snackbarMessage != null}
            duration={Snackbar.DURATION_SHORT}
            onDismiss={() => this.setState({ snackbarMessage: null })}>
            {this.state.snackbarMessage}
          </Snackbar>
        </ScrollView>
      </View>
    );
  }
}
