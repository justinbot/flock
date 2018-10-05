import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NearbyAPI } from 'react-native-nearby-api';

import config from 'yeet/constants/Config';
import TabBarIcon from 'yeet/components/TabBarIcon';


// BLE only
const nearbyAPI = new NearbyAPI(true);

export default class AroundScreen extends React.Component {
  static navigationOptions = {
    title: 'Around me',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabBarIcon name={'users'} focused={focused} tintColor={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      nearbyMessage: null,
      isPublishing: false,
      isSubscribing: false
    };
  }

  componentDidMount() {
      console.log("Mounting ", NearbyAPI);

      nearbyAPI.onConnected(message => {
        console.log(message);
        nearbyAPI.isConnected((connected, error) => {
          this.setState({
            nearbyMessage: `Connected - ${message}`,
            isConnected: connected
          });
        });
      });

      nearbyAPI.onDisconnected(message => {
        console.log(message);
        this.setState({
          isConnected: false,
          nearbyMessage: `Disconnected - ${message}`
        });
      });

      nearbyAPI.onFound(message => {
        console.log("Message Found!");
        console.log(message);
        this.setState({ nearbyMessage: `Message Found - ${message}` });
      });

      nearbyAPI.onLost(message => {
        console.log("Message Lost!");
        console.log(message);
        this.setState({ nearbyMessage: `Message Lost - ${message}` });
      });

      nearbyAPI.onDistanceChanged((message, value) => {
        console.log("Distance Changed!");
        console.log(message, value);
        this.setState({
          nearbyMessage: `Distance Changed - ${message} - ${value}`
        });
      });

      nearbyAPI.onPublishSuccess(message => {
        nearbyAPI.isPublishing((status, error) => {
          this.setState({
            nearbyMessage: `Publish Success - ${message}`,
            isPublishing: status
          });
        });
      });

      nearbyAPI.onPublishFailed(message => {
        console.log(message);
        nearbyAPI.isPublishing((status, error) => {
          this.setState({
            nearbyMessage: `Publish Failed - ${message}`,
            isPublishing: status
          });
        });
      });

      nearbyAPI.onSubscribeSuccess(() => {
        nearbyAPI.isSubscribing((status, error) => {
          this.setState({
            nearbyMessage: `Subscribe Success`,
            isSubscribing: status
          });
        });
      });

      nearbyAPI.onSubscribeFailed(() => {
        nearbyAPI.isSubscribing((status, error) => {
          this.setState({
            nearbyMessage: `Subscribe Failed`,
            isSubscribing: status
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
          isConnected: connected
        });
      });
    } else {
      nearbyAPI.connect(config.nearbyConfig.apiKey);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Is connected: { this.state.isConnected.toString() }</Text>
        <Text>Nearby message: { this.state.nearbyMessage }</Text>
        <Text>Connect text: { this.state.connectText }</Text>
        <Text>Is publishing: { this.state.isPublishing.toString() }</Text>
        <Text>Is subscribing: { this.state.isSubscribing.toString() }</Text>
        <Button onPress={this._handleConnect}>
          {this.state.isConnected ? "DISCONNECT" : "CONNECT"}
        </Button>
      </View>
    );
  }
}
