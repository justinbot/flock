import React from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Appbar, Button, Divider, Paragraph, Snackbar, Subheading, Surface, Text } from 'react-native-paper';
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
                    source={{ uri: this.state.userProfile.get('avatar_url') }}
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
      return (
        <Button
          mode="contained"
          style={CommonStyles.containerItem}
          onPress={this._chooseAvatarImageAsync}>
          <Subheading style={{ color: '#ffffff' }}>Send message</Subheading>
        </Button>
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
              <Appbar.Action icon="more-vert" onPress={this._onMore} />
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
