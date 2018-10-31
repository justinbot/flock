import React from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Icon } from 'expo';
import { Appbar, Button, Snackbar, Subheading, Switch, Text, Title } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import * as Animatable from 'react-native-animatable';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';
import PendingFriendshipList from 'src/components/People/PendingFriendshipList';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingFriendships: [],
      loadingPendingFriendships: false,
      friendships: [],
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
              console.log([{ userProfile, friendship }, ...this.state.pendingFriendships]);
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

    firebase
      .firestore()
      .collection('friends')
      .where('user_to', '==', firebase.auth().currentUser.uid)
      .where('accepted', '==', true)
      .onSnapshot(querySnapshot => {
        this.setState({ friendships: querySnapshot.docs });
      });
  }

  _onPressItem = userProfile => {
    this.props.navigation.navigate('ProfileDetail', {
      userProfile,
    });
  };

  _pendingFriendshipsComponent = () => {
    if (this.state.pendingFriendships.length > 0) {
      return (
        <View>
          <View style={CommonStyles.containerItem}>
            <Subheading>
              Pending requests
              {` (${this.state.pendingFriendships.length})` && this.state.pendingFriendships.length > 0}
            </Subheading>
          </View>
          <PendingFriendshipList
            data={this.state.pendingFriendships}
            loading={this.state.loadingPendingFriendships}
            onPressItem={this._onPressItem}
          />
        </View>
      );
    } else {
      return null;
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
