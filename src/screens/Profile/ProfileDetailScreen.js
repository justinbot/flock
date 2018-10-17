import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Appbar, Divider, Headline, Paragraph, Snackbar, Surface, Text } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userProfile: this.props.navigation.getParam('userProfile'),
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.state.userProfile.id)
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
        <View style={{ flex: 1 }}>
          <View style={{ margin: theme.marginHorizontal }}>
            <Transition shared={'avatarImage' + this.state.userProfile.id}>
              <Image
                source={{ uri: this.state.userProfile.get('avatar_url') }}
                style={{ flex: 1, aspectRatio: 1, borderRadius: 20 }}
                resizeMode="cover"
              />
            </Transition>
          </View>
          <View style={CommonStyles.containerItem}>
            <Transition shared={'displayName' + this.state.userProfile.id}>
              <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
                {this.state.userProfile.get('display_name')}
              </Text>
            </Transition>
            <Divider style={{ backgroundColor: theme.colors.primary, height: 2 }}/>
            <Transition shared={'details' + this.state.userProfile.id}>
              <Paragraph style={{ marginVertical: theme.marginVertical}}>{this.state.userProfile.get('details')}</Paragraph>
            </Transition>
          </View>
        </View>
      );
    } else {
      console.log('missing profile for details');
      return <Text>TODO missing profile</Text>;
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top">
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
              <Appbar.Content title="Nearby Flocker" />
            </Appbar.Header>
          </View>
        </Transition>
        <ScrollView style={{ flex: 1}}>
          {this._userProfileContent()}
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
