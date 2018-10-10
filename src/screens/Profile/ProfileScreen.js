import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  Headline,
  Paragraph,
  Snackbar,
  Surface,
  Text,
  Title,
} from 'react-native-paper';
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
        <View>
          <Image
            style={{ width: '100%', height: 400 }}
            resizeMode="cover"
            source={{ uri: this.state.userProfile.get('avatar_url') }}
          />
          <View style={CommonStyles.containerItem}>
            <Headline>{this.state.userProfile.get('display_name')}</Headline>
            <Paragraph>{this.state.userProfile.get('details')}</Paragraph>

            {/*<Text>Email: {this.state.currentUser.email}</Text>*/}
            {/*<Text>Email verified: {this.state.currentUser.emailVerified.toString()}</Text>*/}
            {/*<Text>Created: {this.state.currentUser.metadata.creationTime}</Text>*/}
            {/*<Text>Last sign in: {this.state.currentUser.metadata.lastSignInTime}</Text>*/}
          </View>
        </View>
      );
    } else {
      return <Text>TODO loader</Text>;
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        <Surface style={{ flex: 1 }}>
          {/*TODO description*/}
          {this._userProfileContent()}
          <View style={CommonStyles.containerItem}>
            <Divider />
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
          </View>
          <Snackbar
            visible={this.state.snackbarMessage != null}
            duration={Snackbar.DURATION_SHORT}
            onDismiss={() => this.setState({ snackbarMessage: null })}>
            {this.state.snackbarMessage}
          </Snackbar>
        </Surface>
      </ScrollView>
    );
  }
}
