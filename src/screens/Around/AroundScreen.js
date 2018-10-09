import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Switch, Text, Title } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import { NearbyAPI } from 'react-native-nearby-api';

import config from 'src/constants/Config';
import TabBarIcon from 'src/components/TabBarIcon';
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
      nearbyConnected: false,
      nearbyPublishing: false,
      nearbySubscribing: false,
      foundUserData: [],
    };
  }

  componentDidMount() {
    // this._fetchUserDataAsync('GkF10yJcLqX0QkQp0vNebKTgKWM2');

    nearbyAPI.onConnected(message => {
      console.log('onConnected: ' + message);
      this._handleConnected();
    });

    nearbyAPI.onDisconnected(message => {
      console.log('onDisconnected: ' + message);
      this._handleConnected();
    });

    nearbyAPI.onDistanceChanged((message, value) => {
      console.log('onDistanceChanged: ' + message + ' ' + value);
    });

    nearbyAPI.onPublishSuccess(message => {
      console.log('onPublishSuccess: ' + message);
      this._handlePublishing();
    });

    nearbyAPI.onPublishFailed(message => {
      console.log('onPublishFailed: ' + message);
      this._handlePublishing();
    });

    nearbyAPI.onSubscribeSuccess(() => {
      console.log('onSubscribeSuccess');
      this._handleSubscribing();
    });

    nearbyAPI.onSubscribeFailed(() => {
      console.log('onSubscribeFailed');
      this._handleSubscribing();
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
    // nearbyAPI.connect();
  }

  componentWillUnmount() {
    console.log('around screen will unmount!');
    // TODO unpublish
  }

  _handleConnected = () => {
    nearbyAPI.isConnected((connected, error) => {
      this.setState({
        nearbyConnected: connected,
      });
      if (connected) {
        // Publish user id
        nearbyAPI.publish(this.state.currentUser.uid);
        // Subscribe to find users
        nearbyAPI.subscribe();
      } else {
        // TODO not connected
        this.setState({ foundUserData: [] });
      }
      if (error) {
        // TODO Log to error reporting
        console.warn(error);
      }
    });
  };

  _handlePublishing = () => {
    nearbyAPI.isPublishing((publishing, error) => {
      this.setState({
        nearbyPublishing: publishing,
      });
      if (publishing) {
      } else {
        // TODO not publishing
      }
      if (error) {
        // TODO Log to error reporting
        console.warn(error);
      }
    });
  };

  _handleSubscribing = () => {
    nearbyAPI.isSubscribing((subscribing, error) => {
      this.setState({
        nearbySubscribing: subscribing,
      });
      if (subscribing) {
      } else {
        // TODO not subscribing
      }
      if (error) {
        // TODO Log to error reporting
        console.warn(error);
      }
    });
  };

  _handleMessageFound = async message => {
    // When a message is found, fetch user data and add to list.
    console.log('handling message found!');
    if (message === this.state.currentUser.uid) {
      console.log('Discovered self!');
      // TODO discovered self
    } else {
      let userData = await this._fetchUserDataAsync(message);
      this.setState({ foundUserData: [...this.state.foundUserData, userData] });
    }
  };

  _handleMessageLost = message => {
    // When a message is lost, remove user data from list.
    let foundUserData = this.state.foundUserData.filter(item => {
      return item.userId !== message;
    });

    this.setState({ foundUserData });
  };

  _handleConnect = () => {
    if (this.state.nearbyConnected) {
      nearbyAPI.disconnect();
    } else {
      nearbyAPI.connect();
    }
  };

  _fetchUserDataAsync = async userId => {
    let userProfile = await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get();
    // TODO handle error
    return {
      userId,
      displayName: userProfile.get('display_name'),
      details: userProfile.get('details'),
      avatarUrl: userProfile.get('avatar_url'),
    };
  };

  _onPressItem = userId => {
    this.props.navigation.navigate('ProfileDetail', { userId });
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
          <Appbar.Content title="Around me" />
        </Appbar.Header>
        <View>
          <Text>Nearby connected: {this.state.nearbyConnected.toString()}</Text>
          <Text>Nearby publishing: {this.state.nearbyPublishing.toString()}</Text>
          <Text>Nearby subscribing: {this.state.nearbySubscribing.toString()}</Text>
          <Button onPress={this._handleConnect}>
            {this.state.nearbyConnected ? 'DISCONNECT' : 'CONNECT'}
          </Button>
        </View>
        <UserList data={this.state.foundUserData} onPressItem={this._onPressItem} />
      </View>
    );
  }
}
