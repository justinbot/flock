import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import {
  Button,
  Card,
  Divider,
  Headline,
  Paragraph,
  Snackbar,
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
  static navigationOptions = {
    header: null,
  };

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
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ margin: theme.marginHorizontal, marginTop: 40 }}>
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
                <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
                  {this.state.userProfile.get('display_name')}
                </Text>
              </Transition>
              <Divider style={{ backgroundColor: theme.colors.primary, height: 2 }}/>
              <Transition shared={'details'}>
                <Paragraph style={{ marginVertical: theme.marginVertical}}>{this.state.userProfile.get('details')}</Paragraph>
              </Transition>

              {/*<Text>Email: {this.state.currentUser.email}</Text>*/}
              {/*<Text>Email verified: {this.state.currentUser.emailVerified.toString()}</Text>*/}
              {/*<Text>Created: {this.state.currentUser.metadata.creationTime}</Text>*/}
              {/*<Text>Last sign in: {this.state.currentUser.metadata.lastSignInTime}</Text>*/}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <Text>TODO loader</Text>;
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView>
          <Surface style={{ elevation: 2, paddingBottom: theme.marginVertical }}>{this._userProfileContent()}</Surface>
          <View style={CommonStyles.containerItem}>
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
