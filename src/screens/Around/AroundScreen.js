import React from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Snackbar, Subheading, Switch, Text, Title } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import * as Animatable from 'react-native-animatable';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import { NearbyAPI } from 'react-native-nearby-api';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';
import UserList from 'src/components/Around/UserList';

const nearbyAPI = new NearbyAPI();

export default class AroundScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      snackbarMessage: null,
      currentUser: firebase.auth().currentUser,
      userLooking: true,
      userVisible: false,
      nearbyConnected: false,
      nearbyPublishing: false,
      nearbySubscribing: false,
      loadingUserProfile: false,
      foundUserProfiles: [],
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    nearbyAPI.onConnected(message => {
      console.log('onConnected: ' + message);
      this.setState({
        nearbyConnected: true,
      });
      // Subscribe once we are connected
      this._nearbySubscribe();
    });

    nearbyAPI.onDisconnected(message => {
      console.log('onDisconnected: ' + message);
      this._nearbyUnpublish();
      this._nearbyUnsubscribe();
      this.setState({
        nearbyConnected: false,
      });
    });

    nearbyAPI.onDistanceChanged((message, value) => {
      console.log('onDistanceChanged: ' + message + ' ' + value);
    });

    nearbyAPI.onPublishSuccess(message => {
      console.log('onPublishSuccess: ' + message);
      this.setState({
        nearbyPublishing: true,
      });
    });

    nearbyAPI.onPublishFailed(message => {
      console.log('onPublishFailed: ' + message);
      this.setState({
        userVisible: false,
        nearbyPublishing: false,
        snackbarMessage: "Couldn't make profile visible",
      });
    });

    nearbyAPI.onSubscribeSuccess(message => {
      console.log('onSubscribeSuccess: ' + message);
      this.setState({
        nearbySubscribing: true,
      });
    });

    nearbyAPI.onSubscribeFailed(message => {
      console.log('onSubscribeFailed: ' + message);
      this.setState({
        nearbySubscribing: false,
        snackbarMessage: "Couldn't look for nearby users",
      });
    });

    nearbyAPI.onFound(message => {
      console.log('Found message: ' + message);
      this._handleMessageFound(message);
    });

    nearbyAPI.onLost(message => {
      console.log('Lost message: ' + message);
      this._handleMessageLost(message);
    });
    this._verifyNearbyState();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // When app enters foreground, we must publish and subscribe again
      this._verifyNearbyState();
    } else {
      // TODO App entered background or inactive
    }
    this.setState({ appState: nextAppState });
  };

  _nearbyConnect = () => {
    // Connect to Nearby; on Android, API key is taken from manifest
    nearbyAPI.connect();
    // State is set in onConnected and onDisconnected
  };

  _nearbyDisconnect = () => {
    nearbyAPI.disconnect();
    // State is set in onConnected and onDisconnected
  };

  _nearbyPublish = () => {
    // TODO: Deal with hard-coded TTL of 180 in RNNearbyApiModule.java line 237
    nearbyAPI.publish(this.state.currentUser.uid);
    this.setState({
      userVisible: true,
    });
    // State is set in onPublishSuccess or onPublishFailed
  };

  _nearbyUnpublish = () => {
    nearbyAPI.unpublish();
    this.setState({
      userVisible: false,
      nearbyPublishing: false,
    });
  };

  _nearbySubscribe = () => {
    nearbyAPI.subscribe();
    this.setState({
      userLooking: true,
    });
    // State is set in onSubscribeSuccess or onSubscribeFailed
  };

  _nearbyUnsubscribe = () => {
    nearbyAPI.unsubscribe();
    this.setState({
      userLooking: false,
      nearbySubscribing: false,
      foundUserProfiles: [],
    });
  };

  _verifyNearbyState = () => {
    nearbyAPI.isConnected((connected, error) => {
      if (connected) {
        if (this.state.userLooking) {
          // User wants to be looking, we should be subscribing
          nearbyAPI.isSubscribing((subscribing, error) => {
            if (!subscribing) {
              this._nearbySubscribe();
            }
          });
        }

        if (this.state.userVisible) {
          // User wants to be visible, we should be publishing
          nearbyAPI.isPublishing((publishing, error) => {
            if (!publishing) {
              this._nearbyPublish();
            }
          });
        }
      } else {
        // Not connected, we should be connected
        this._nearbyConnect();
      }
    });
  };

  _handleMessageFound = async userId => {
    // When a message is found, fetch user data and add to list.
    if (userId === this.state.currentUser.uid) {
      // TODO discovered self
    } else {
      // Ignore duplicates
      if (!this.state.foundUserProfiles.some(e => e.id === userId)) {
        // Fetch user profile data
        this.setState({ loadingUserProfile: true });
        let userProfile = await this._fetchUserProfileAsync(userId);
        if (userProfile) {
          if (userProfile.exists) {
            this.setState({ foundUserProfiles: [userProfile, ...this.state.foundUserProfiles] });
          } else {
            // User profile is missing
            this.setState({ snackbarMessage: "Couldn't load a user profile" });
          }
        } else {
          // Failed to load user profile
          // TODO Log to error reporting
          this.setState({ snackbarMessage: "Couldn't load a user profile" });
        }

        this.setState({ loadingUserProfile: false });
      }
    }
  };

  _handleMessageLost = userId => {
    // When a message is lost, remove user profile from list.
    // TODO Keep message for some duration after lost
    // Set to remove in some seconds, cancel if user is found again
    let foundUserProfiles = this.state.foundUserProfiles.filter(profile => {
      return profile.id !== userId;
    });

    this.setState({ foundUserProfiles });
  };

  _fetchUserProfileAsync = async userId => {
    try {
      let userProfile = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get();
      return userProfile;
    } catch (err) {
      // TODO Log error getting profile
      console.warn(err);
      return null;
    }
  };

  _toggleUserLooking = () => {
    if (this.state.userLooking) {
      // User no longer wants to subscribe
      this._nearbyUnsubscribe();
    } else {
      // User wants to subscribe
      this._nearbySubscribe();
    }
  };

  _toggleUserVisible = () => {
    if (this.state.userVisible) {
      // User no longer wants to publish
      this._nearbyUnpublish();
    } else {
      // User wants to publish
      this._nearbyPublish();
    }
  };

  _onPressItem = userProfile => {
    this.props.navigation.navigate('ProfileDetail', {
      userProfile,
    });
  };

  _userListComponent = () => {
    if (this.state.nearbySubscribing) {
      if (this.state.foundUserProfiles.length > 0) {
        return (
          <UserList
            data={this.state.foundUserProfiles}
            loadingItem={this.state.loadingUserProfile}
            onPressItem={this._onPressItem}
          />
        );
      } else {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ color: theme.colors.disabled }}>Looking around...</Title>
            <Animatable.View
              animation="tada"
              duration={1800}
              easing="linear"
              iterationCount="infinite"
              iterationDelay={800}
              useNativeDriver>
              <Icon.Feather name="radio" size={60} color={theme.colors.disabled} />
            </Animatable.View>
          </View>
        );
      }
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Title style={{ color: theme.colors.disabled }}>Couldn't connect :(</Title>
          <Icon.Feather name="wifi-off" size={60} color={theme.colors.disabled} />
          <Button onPress={() => this._verifyNearbyState()}>Try again!</Button>
        </View>
      );
    }
  };

  _appbarTitle = () => {
    if (this.state.userVisible) {
      return (
        <Text>
          <Icon.Feather name="eye" color={theme.colors.primary} size={24} />
          {'  '}
          <Subheading>Visible</Subheading>
        </Text>
      );
    } else {
      return (
        <Text>
          <Icon.Feather name="eye-off" color={theme.colors.disabled} size={24} />
          {'  '}
          <Subheading style={{ color: theme.colors.disabled }}>Invisible</Subheading>
        </Text>
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: theme.colors.background }}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }} statusBarHeight={0}>
          <Appbar.Content title={this._appbarTitle()} />
          <Transition appear="right" disappear="right">
            <Switch
              color={theme.colors.primary}
              value={this.state.userVisible}
              disabled={!this.state.nearbyConnected}
              onValueChange={this._toggleUserVisible}
            />
          </Transition>
        </Appbar.Header>
        {this._userListComponent()}
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
