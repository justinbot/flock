import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Switch, Text } from 'react-native-paper';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import { NearbyAPI } from 'react-native-nearby-api';

import config from 'src/constants/Config';
import theme from 'src/constants/Theme';
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
      isConnected: false,
      nearbyMessage: null,
      isPublishing: false,
      isSubscribing: false,
      nearbyUserData: [],
    };
  }

  componentDidMount() {
    this._fetchUserDataAsync('GkF10yJcLqX0QkQp0vNebKTgKWM2');

    nearbyAPI.onConnected(message => {
      console.log(message);
      nearbyAPI.isConnected((connected, error) => {
        this.setState({
          nearbyMessage: `Connected - ${message}`,
          isConnected: connected,
        });
      });
    });

    nearbyAPI.onDisconnected(message => {
      console.log(message);
      this.setState({
        isConnected: false,
        nearbyMessage: `Disconnected - ${message}`,
      });
    });

    nearbyAPI.onFound(message => {
      // TODO: When a new message (user) is found, fetch their data and add to list
      console.log('Message Found!');
      console.log(message);
      this.setState({ nearbyMessage: `Message Found - ${message}` });
    });

    nearbyAPI.onLost(message => {
      // TODO: When a user is lost, remove their data from list
      console.log('Message Lost!');
      console.log(message);
      this.setState({ nearbyMessage: `Message Lost - ${message}` });
    });

    nearbyAPI.onDistanceChanged((message, value) => {
      console.log('Distance Changed!');
      console.log(message, value);
      this.setState({
        nearbyMessage: `Distance Changed - ${message} - ${value}`,
      });
    });

    nearbyAPI.onPublishSuccess(message => {
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Success - ${message}`,
          isPublishing: status,
        });
      });
    });

    nearbyAPI.onPublishFailed(message => {
      console.log(message);
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Failed - ${message}`,
          isPublishing: status,
        });
      });
    });

    nearbyAPI.onSubscribeSuccess(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Success`,
          isSubscribing: status,
        });
      });
    });

    nearbyAPI.onSubscribeFailed(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Failed`,
          isSubscribing: status,
        });
      });
    });
  }

  _handleConnect = () => {
    if (this.state.isConnected) {
      nearbyAPI.disconnect();
      nearbyAPI.isConnected((connected, error) => {
        this.setState({
          nearbyMessage: 'Disconnected',
          isConnected: connected,
        });
      });
    } else {
      nearbyAPI.connect(config.nearbyConfig.apiKey);
    }
  };

  _fetchUserDataAsync = async userId => {
    let userProfile = await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get();
    // TODO handle error
    let userData = {
      userId,
      displayName: userProfile.get('display_name'),
      details: userProfile.get('details'),
      avatarUrl: userProfile.get('avatar_url'),
    };
    this.setState({ nearbyUserData: [...this.state.nearbyUserData, userData] });
  };

  _onPressItem = userId => {
    this.props.navigation.navigate('ProfileDetail', { userId });
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
          <Appbar.Content title="Around me" />
          <Switch value color={theme.colors.primary} />
          {/*<Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />*/}
          {/*<Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />*/}
          {/*<Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')} />*/}
        </Appbar.Header>
        <View>
          <Text>Is connected: {this.state.isConnected.toString()}</Text>
          <Text>Nearby message: {this.state.nearbyMessage}</Text>
          <Text>Connect text: {this.state.connectText}</Text>
          <Text>Is publishing: {this.state.isPublishing.toString()}</Text>
          <Text>Is subscribing: {this.state.isSubscribing.toString()}</Text>
          <Button onPress={this._handleConnect}>
            {this.state.isConnected ? 'DISCONNECT' : 'CONNECT'}
          </Button>
        </View>
        <UserList data={this.state.nearbyUserData} onPressItem={this._onPressItem} />
      </View>
    );
  }
}
