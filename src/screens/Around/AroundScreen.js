import React from 'react';
import { View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Snackbar, Switch, Text, Title } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import { NearbyAPI } from 'react-native-nearby-api';

import theme from 'src/constants/Theme';
import UserList from 'src/components/Around/UserList';

// BLE only
const nearbyAPI = new NearbyAPI(true);

export default class AroundScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      snackbarMessage: null,
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
      // this._handlePublishing();
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
    nearbyAPI.connect();
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
        this.setState({ loadingUserProfile: false });
        if (userProfile.exists) {
          this.setState({ foundUserProfiles: [...this.state.foundUserProfiles, userProfile] });
        } else {
          console.log('Failed to load user profile');
          this.setState({ snackbarMessage: "Couldn't load a user profile" });
        }
      }
    }
  };

  _handleMessageLost = userId => {
    // When a message is lost, remove user profile from list.
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
    this.props.navigation.navigate('ProfileDetail', { userProfile });
  };

  _userListComponent = () => {
    if (this.state.nearbySubscribing) {
      return (
        <UserList
          data={this.state.foundUserProfiles}
          loadingItem={this.state.loadingUserProfile}
          onPressItem={this._onPressItem}
        />
      );
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title style={{ color: theme.colors.disabled }}>Couldn't connect :(</Title>
          <Icon.Feather name="wifi-off" size={60} color={theme.colors.disabled} />
          <Button onPress={() => nearbyAPI.subscribe()}>Try again!</Button>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
          <Appbar.Content title="Around me" />
          <Switch
            value={this.state.userVisible}
            disabled={!this.state.nearbyConnected}
            onValueChange={this._handleUserVisible}
          />
        </Appbar.Header>
        <View>
          <Text>Nearby connected: {this.state.nearbyConnected.toString()}</Text>
          <Text>Nearby publishing: {this.state.nearbyPublishing.toString()}</Text>
          <Text>Nearby subscribing: {this.state.nearbySubscribing.toString()}</Text>
          <Button
            onPress={() => {
              if (this.state.nearbyConnected) {
                nearbyAPI.disconnect();
                this._unsubscribeNearby();
                nearbyAPI.unpublish();
              } else {
                nearbyAPI.connect();
              }
            }}>
            {this.state.nearbyConnected ? 'DISCONNECT' : 'CONNECT'}
          </Button>
        </View>
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
