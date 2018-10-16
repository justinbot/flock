import React from 'react';
import { AppState, View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Snackbar, Subheading, Switch, Text, Title } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import * as Animatable from 'react-native-animatable';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import { NearbyAPI } from 'react-native-nearby-api';

import theme from 'src/constants/Theme';
import UserList from 'src/components/Around/UserList';

const nearbyAPI = new NearbyAPI();

export default class AroundScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      snackbarMessage: null,
      currentUser: firebase.auth().currentUser,
      userVisible: false,
      nearbyConnected: false,
      nearbyPublishing: false,
      nearbySubscribing: false,
      loadingUserProfile: false,
      foundUserProfiles: [],
    };
  }

  componentDidMount() {
    nearbyAPI.onConnected(message => {
      console.log('onConnected: ' + message);
      this.setState({
        nearbyConnected: true,
      });
      // Subscribe once we are connected
      nearbyAPI.subscribe();
    });

    nearbyAPI.onDisconnected(message => {
      console.log('onDisconnected: ' + message);
      nearbyAPI.unpublish();
      this._unsubscribeNearby();
      this.setState({
        userVisible: false,
        nearbyConnected: false,
        nearbyPublishing: false,
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

    // Connect to Nearby
    // API key is taken from manifest
    // TODO connect automatically
    // nearbyAPI.connect();
  }

  _handleMessageFound = async userId => {
    // When a message is found, fetch user data and add to list.
    if (userId === this.state.currentUser.uid) {
      // TODO discovered self
    } else {
      // Ignore duplicates
      if (!this.state.foundUserProfiles.some(e => e.userId === userId)) {
        // Fetch user profile data
        this.setState({ loadingUserProfile: true });
        let userProfile = await this._fetchUserProfileAsync(userId);
        if (userProfile) {
          if (userProfile.exists) {
            this.setState({ foundUserProfiles: [...this.state.foundUserProfiles, userProfile] });
          } else {
            console.log('User profile missing');
            this.setState({ snackbarMessage: "Couldn't load a user profile" });
          }
        } else {
          console.log('Failed to load user profile');
          this.setState({ snackbarMessage: "Couldn't load a user profile" });
        }

        this.setState({ loadingUserProfile: false });
      }
    }
  };

  _handleMessageLost = userId => {
    // When a message is lost, remove user profile from list.
    // TODO Keep message for some duration after lost
    let foundUserProfiles = this.state.foundUserProfiles.filter(profile => {
      return profile.id !== userId;
    });

    this.setState({ foundUserProfiles });
  };

  _handleUserVisible = () => {
    if (this.state.userVisible) {
      // User does not want to be visible
      nearbyAPI.unpublish();
      this.setState({
        userVisible: false,
        nearbyPublishing: false,
      });
    } else {
      // User wants to be visible
      // TODO: Deal with hard-coded TTL of 180 in RNNearbyApiModule.java line 237
      nearbyAPI.publish(this.state.currentUser.uid);
      this.setState({
        userVisible: true,
      });
    }
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

  _unsubscribeNearby = () => {
    nearbyAPI.unsubscribe();
    this.setState({
      nearbySubscribing: false,
      foundUserProfiles: [],
    });
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
          <Button onPress={() => nearbyAPI.connect()}>Try again!</Button>
        </View>
      );
    }
  };

  _appbarTitle = () => {
    if (this.state.userVisible) {
      return(
        <Text>
          <Icon.Feather name="eye" color={theme.colors.primary} size={24} />
          {'  '}
          <Subheading>Visible</Subheading>
        </Text>
      );
    } else {
      return(
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
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.Content title={this._appbarTitle()} />
          <Switch
            color={theme.colors.primary}
            value={this.state.userVisible}
            disabled={!this.state.nearbyConnected}
            onValueChange={this._handleUserVisible}
          />
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
