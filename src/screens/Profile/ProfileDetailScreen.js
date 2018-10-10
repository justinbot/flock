import React from 'react';
import { Image, View } from 'react-native';
import { Divider, Headline, Paragraph, Snackbar, Surface, Text } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Nearby Flocker',
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
      .doc(this.props.navigation.getParam('userProfile').id)
      .onSnapshot(
        userProfile => {
          if (userProfile.exists) {
            this.setState({ userProfile });
          } else {
            // TODO User missing profile
            this.setState({
              snackbarMessage: "User doesn't have a profile",
              userProfile: null,
            });
          }
        },
        err => {
          // TODO log to error reporting
          console.log(err);
          this.setState({ snackbarMessage: "Couldn't load user profile" });
        }
      );
  }

  _userProfileContent = () => {
    if (this.state.userProfile) {
      return (
        <View>
          <Image
            style={{ width: '100%', height: 300 }}
            resizeMode="cover"
            source={{ uri: this.state.userProfile.get('avatar_url') }}
          />
          <View style={CommonStyles.containerItem}>
            <Headline>{this.state.userProfile.get('display_name')}</Headline>
            <Paragraph>{this.state.userProfile.get('details')}</Paragraph>
          </View>
        </View>
      );
    } else {
      return <Text>TODO loader</Text>;
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <Surface style={{ flex: 1 }}>
        {this._userProfileContent()}
        <Divider />
        <Snackbar
          visible={this.state.snackbarMessage != null}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({ snackbarMessage: null })}>
          {this.state.snackbarMessage}
        </Snackbar>
      </Surface>
    );
  }
}
