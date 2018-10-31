import React from 'react';
import {
  ActivityIndicator,
  Image,
  findNodeHandle,
  ScrollView,
  UIManager,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  Paragraph,
  Snackbar,
  Subheading,
  Surface,
  Text,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Transition } from 'react-navigation-fluid-transitions';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: this.props.navigation.getParam('userProfile'),
      friendship: null,
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

    firebase
      .firestore()
      .collection('friends')
      .where('user_from', '==', firebase.auth().currentUser.uid)
      .where('user_to', '==', this.state.userProfile.id)
      .limit(1)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          this.setState({ friendship: null });
        } else {
          this.setState({ friendship: querySnapshot.docs[0] });
        }
      });
  }

  _addFriendRequest = () => {
    firebase
      .firestore()
      .collection('friends')
      .add({
        user_from: firebase.auth().currentUser.uid,
        user_to: this.state.userProfile.id,
        accepted: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch(err => {
        this.setState({
          snackbarMessage: "Couldn't add friend.",
        });
      })
      .then(() => {
        this.setState({
          snackbarMessage: 'Friend request sent.',
        });
      });
  };

  _deleteFriendRequest = () => {
    this.state.friendship.ref
      .delete()
      .catch(err => {
        this.setState({
          snackbarMessage: "Couldn't cancel friend request.",
        });
      })
      .then(() => {
        this.setState({
          snackbarMessage: 'Friend request cancelled.',
        });
      });
  };

  _appbarDropdown = () => {
    // Display native dropdown menu
    let friendAction = 'Add friend';
    if (this.state.friendship) {
      if (this.state.friendship.accepted) {
        friendAction = 'Remove friend';
      } else {
        friendAction = 'Cancel friend request';
      }
    }

    let menuActions = [friendAction, 'Send message', 'Report or block'];
    UIManager.showPopupMenu(
      findNodeHandle(this.refs.appbarAction),
      menuActions,
      error => {
        // TODO Log to error reporting
      },
      (
        action, // "itemSelected", "dismissed"
        index // index of item that's selected
      ) => {
        /* handle action */
        if (action === 'itemSelected') {
          if (index === 0) {
            if (this.state.friendship) {
              if (this.state.friendship.accepted) {
                this._deleteFriendRequest();
              } else {
                this._deleteFriendRequest();
              }
            } else {
              this._addFriendRequest();
            }
          } else if (index === 1) {
            // TODO Handle send message
          } else if (index === 2) {
            // TODO Handle report user
          }
        }
      }
    );
  };

  _userProfileContent = () => {
    if (this.state.userProfile) {
      let avatarImageSource = require('src/assets/images/placeholder.png');
      if (this.state.userProfile.get('avatar_url')) {
        avatarImageSource = { uri: this.state.userProfile.get('avatar_url') };
      }
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
                <Transition shared={'avatarImage' + this.state.userProfile.id}>
                  <Image
                    source={avatarImageSource}
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                </Transition>
              </View>
            </View>
            <View style={CommonStyles.containerItem}>
              <Transition shared={'displayName' + this.state.userProfile.id}>
                <Text
                  style={{
                    fontFamily: theme.fonts.alternateMedium,
                    fontSize: 32,
                    fontWeight: 'bold',
                  }}>
                  {this.state.userProfile.get('display_name')}
                </Text>
              </Transition>
              <Transition shared={'details' + this.state.userProfile.id}>
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

  _userProfileActions = () => {
    if (this.state.userProfile) {
      let friendButton = (
        <Button
          mode="contained"
          style={CommonStyles.containerItem}
          onPress={this._addFriendRequest}>
          <Subheading style={{ color: '#ffffff' }}>Add friend</Subheading>
        </Button>
      );

      if (this.state.friendship) {
        if (this.state.friendship.accepted) {
          friendButton = null;
        } else {
          friendButton = (
            <Button
              mode="contained"
              style={CommonStyles.containerItem}
              onPress={this._deleteFriendRequest}>
              <Subheading style={{ color: '#ffffff' }}>Cancel friend request</Subheading>
            </Button>
          );
        }
      }

      return (
        <View>
          {friendButton}
          <Button
            mode="contained"
            style={CommonStyles.containerItem}
            onPress={() => console.log('TODO Message')}>
            <Subheading style={{ color: '#ffffff' }}>Message</Subheading>
          </Button>
        </View>
      );
    } else {
      // TODO loading
      return <View />;
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top" delay>
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
              <Appbar.Content />
              <Appbar.Action ref="appbarAction" icon="more-vert" onPress={this._appbarDropdown} />
            </Appbar.Header>
          </View>
        </Transition>
        <ScrollView>
          <Surface style={{ elevation: 2, paddingBottom: theme.marginVertical }}>
            {this._userProfileContent()}
          </Surface>
          <View style={CommonStyles.container}>{this._userProfileActions()}</View>
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
