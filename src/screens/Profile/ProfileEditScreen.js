import React from 'react';
import { Image, ImageEditor, View } from 'react-native';
import { ImagePicker } from 'expo';
import {
  Appbar,
  Button,
  Card,
  Dialog,
  Divider,
  Paragraph,
  Portal,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { v4 as uuid } from 'uuid';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';
import 'expo-firebase-storage';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: null,
      userProfile: null,
      formDisplayName: null,
      formDetails: null,
      formAvatarUrl: null,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        userProfile => {
          if (userProfile.exists) {
            this.setState({
              userProfile,
              formDisplayName: userProfile.get('display_name'),
              formDetails: userProfile.get('details'),
              formAvatarUrl: userProfile.get('avatar_url'),
            });
          } else {
            // TODO User missing profile, could be first time
            this.setState({
              snackbarMessage: "User doesn't have a profile",
              userProfile: null,
              formDisplayName: null,
              formDetails: null,
              formAvatarUrl: null,
            });
          }
        },
        err => {
          // TODO log to error reporting
          console.log(err);
          this.setState({ snackbarMessage: "Couldn't load user profile" });
        }
      );

    // Save profile on navigate away
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      this._saveProfileAsync
    );
  }

  componentWillUnmount() {
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _saveProfileAsync = async () => {
    // TODO Loader while saving, save on exit
    return firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .set(
        {
          display_name: this.state.formDisplayName,
          details: this.state.formDetails,
          avatar_url: this.state.formAvatarUrl,
        },
        {
          merge: true,
        }
      );
    // TODO Handle error
  };

  _uploadAvatarImageAsync = async uri => {
    this.setState({
      snackbarMessage: 'Uploading avatar...',
    });

    // Upload avatar with a unique name
    let uploadedAvatarPath = `/images/${firebase.auth().currentUser.uid}/avatars/${uuid()}`;
    try {
      let avatarRef = firebase.storage().ref(uploadedAvatarPath);

      // Upload the file
      await avatarRef.putFile(uri);

      // Get url and save it to user profile
      let uploadedAvatarUrl = await avatarRef.getDownloadURL();
      await this.setState({ formAvatarUrl: uploadedAvatarUrl });
      await this._saveProfileAsync();
      this.setState({
        snackbarMessage: 'Uploaded avatar image',
      });
    } catch (err) {
      console.warn(err);
      this.setState({
        snackbarMessage: 'Failed to upload avatar',
      });
    }
  };

  _chooseAvatarImageAsync = async () => {
    let launchCamera = false;
    let result;
    if (launchCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        exif: false,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        exif: false,
      });
    }

    if (result.cancelled) {
      return;
    }

    // Modify the image based on edits
    let resizedUri = await new Promise((resolve, reject) => {
      ImageEditor.cropImage(
        result.uri,
        {
          offset: { x: 0, y: 0 },
          size: { width: result.width, height: result.height },
          displaySize: { width: 1200, height: 1200 },
          resizeMode: 'contain',
        },
        uri => resolve(uri),
        () => reject()
      );
    });

    this._uploadAvatarImageAsync(resizedUri);
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top">
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
              <Appbar.Content title="Edit profile" />
            </Appbar.Header>
          </View>
        </Transition>
        <KeyboardAwareScrollView>
          <View style={CommonStyles.container}>
            <Transition shared={'avatarImage'}>
              <Card style={[CommonStyles.containerItem, { overflow: 'hidden' }]}>
                <Image
                  source={{ uri: this.state.formAvatarUrl }}
                  style={{ flex: 1, aspectRatio: 1 }}
                  resizeMode="cover"
                />
              </Card>
            </Transition>
            <Button style={CommonStyles.containerItem} onPress={this._chooseAvatarImageAsync}>
              Change avatar
            </Button>
            <Divider />
            <TextInput
              style={CommonStyles.containerItem}
              label="Name"
              mode="outlined"
              maxLength={20}
              value={this.state.formDisplayName}
              onChangeText={formDisplayName => this.setState({ formDisplayName })}
            />
            <TextInput
              style={CommonStyles.containerItem}
              label="Details"
              placeholder="Add some details"
              textAlignVertical="top"
              mode="outlined"
              multiline
              numberOfLines={4}
              value={this.state.formDetails}
              onChangeText={formDetails => this.setState({ formDetails })}
            />
          </View>
        </KeyboardAwareScrollView>
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
