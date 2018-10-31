import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Snackbar, Subheading, Switch, Text, Title } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import * as Animatable from 'react-native-animatable';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';
import FriendshipList from 'src/components/People/FriendshipList';
import PendingFriendshipList from 'src/components/People/PendingFriendshipList';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingFriendships: [],
      loadingPendingFriendships: false,
      friendshipsFrom: [],
      friendshipsTo: [],
      loadingFriendships: false,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('friends')
      .where('user_to', '==', firebase.auth().currentUser.uid)
      .where('accepted', '==', false)
      .onSnapshot(querySnapshot => {
        this.setState({ pendingFriendships: [] });
        querySnapshot.forEach(friendship => {
          firebase
            .firestore()
            .collection('users')
            .doc(friendship.get('user_from'))
            .get()
            .then(userProfile => {
              this.setState({
                pendingFriendships: [{ userProfile, friendship }, ...this.state.pendingFriendships],
              });
            })
            .catch(err => {
              // TODO Couldn't get user profile
              // TODO log to error reporting
              console.log(err);
            });
        });
      });

    // Get accepted friendships in both directions
    firebase
      .firestore()
      .collection('friends')
      .where('user_to', '==', firebase.auth().currentUser.uid)
      .where('accepted', '==', true)
      .onSnapshot(querySnapshot => {
        this.setState({ friendshipsTo: [] });
        querySnapshot.forEach(friendship => {
          firebase
            .firestore()
            .collection('users')
            .doc(friendship.get('user_from'))
            .get()
            .then(userProfile => {
              this.setState({
                friendshipsTo: [{ userProfile, friendship }, ...this.state.friendshipsTo],
              });
            })
            .catch(err => {
              // TODO Couldn't get user profile
              // TODO log to error reporting
              console.log(err);
            });
        });
      });

    firebase
      .firestore()
      .collection('friends')
      .where('user_from', '==', firebase.auth().currentUser.uid)
      .where('accepted', '==', true)
      .onSnapshot(querySnapshot => {
        this.setState({ friendshipsFrom: [] });
        querySnapshot.forEach(friendship => {
          firebase
            .firestore()
            .collection('users')
            .doc(friendship.get('user_to'))
            .get()
            .then(userProfile => {
              this.setState({
                friendshipsFrom: [{ userProfile, friendship }, ...this.state.friendshipsFrom],
              });
            })
            .catch(err => {
              // TODO Couldn't get user profile
              // TODO log to error reporting
              console.log(err);
            });
        });
      });
  }

  _onPressItem = userProfile => {
    this.props.navigation.navigate('ProfileDetail', {
      userProfile,
    });
  };

  _onAcceptItem = friendship => {
    friendship.ref.set({ accepted: true }, { merge: true }).catch(err => {
      // TODO log to error reporting
      console.warn(err);
      this.setState({
        snackbarMessage: "Couldn't accept friend request.",
      });
    });
  };

  _onDeleteItem = friendship => {
    friendship.ref
      .delete()
      .catch(err => {
        // TODO log to error reporting
        console.warn(err);
        this.setState({
          snackbarMessage: "Couldn't delete friend request.",
        });
      })
      .then(() => {
        this.setState({
          snackbarMessage: 'Friend request deleted.',
        });
      });
  };

  _pendingFriendshipsComponent = () => {
    if (this.state.pendingFriendships.length > 0) {
      return (
        <View>
          <View style={CommonStyles.containerItem}>
            <Subheading>
              Pending requests
              {` (${this.state.pendingFriendships.length})` &&
                this.state.pendingFriendships.length > 0}
            </Subheading>
          </View>
          <PendingFriendshipList
            data={this.state.pendingFriendships}
            loading={this.state.loadingPendingFriendships}
            onPressItem={this._onPressItem}
            onAcceptItem={this._onAcceptItem}
            onDeleteItem={this._onDeleteItem}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  _friendshipsComponent = () => {
    let friendships = [...this.state.friendshipsFrom, ...this.state.friendshipsTo];

    friendships.sort((a, b) => {
      return a.friendship.get('timestamp') - b.friendship.get('timestamp');
    });

    if (friendships.length > 0) {
      return (
        <View>
          <View style={CommonStyles.containerItem}>
            <Subheading>
              Friends
              {` (${friendships.length})` && friendships.length > 0}
            </Subheading>
          </View>
          <FriendshipList
            data={friendships}
            loading={this.state.loadingFriendships}
            onPressItem={this._onPressItem}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Title style={{ color: theme.colors.disabled }}>No friends :(</Title>
        </View>
      );
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: theme.colors.background }}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }} statusBarHeight={0}>
          <Appbar.Content title="Friends" />
        </Appbar.Header>
        {this._pendingFriendshipsComponent()}
        {this._friendshipsComponent()}
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
