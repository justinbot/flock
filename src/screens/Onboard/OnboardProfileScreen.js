import React from 'react';
import { Image, ImageEditor, Keyboard, View } from 'react-native';
import { ImagePicker } from 'expo';
import { Appbar, Button, Divider, Snackbar, Subheading, Surface, Title } from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import t from 'src/forms';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { v4 as uuid } from 'uuid';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';
import 'expo-firebase-storage';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

var UserProfile = t.struct({
  display_name: t.String,
  details: t.maybe(t.String),
  avatar_url: t.maybe(t.String),
});

var options = {
  fields: {
    display_name: {
      label: 'Username',
    },
    details: {
      label: 'Details',
    },
    avatar_url: {
      hidden: true,
    },
  },
};

// TODO Considerable code duplication with ProfileEditScreen
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: null,
      userProfileFormValues: {},
    };
  }

  _saveProfileAsync = async () => {
    // TODO Loader while saving
    let userProfileForm = this.refs.userProfileForm.getValue();
    if (userProfileForm) {
      // Get non-null values
      let userProfileFormValues = {};
      Object.keys(userProfileForm).forEach(
        key => userProfileForm[key] !== null && (userProfileFormValues[key] = userProfileForm[key])
      );

      return firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set(userProfileFormValues, {
          merge: true,
        });
      // TODO Handle error
    } else {
      // TODO validation failed
      return new Promise();
    }
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

      // Get url and change it on user profile
      let uploadedAvatarUrl = await avatarRef.getDownloadURL();
      let userProfileFormValues = { ...this.state.userProfileFormValues };
      userProfileFormValues.avatar_url = uploadedAvatarUrl;
      await this.setState({ userProfileFormValues });
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

  _onContinue = () => {
    Keyboard.dismiss();
    // TODO Loader
    this._saveProfileAsync()
      .then(() => this.props.navigation.navigate('AppStack'))
      .catch(err => {
        // Save or validation failed
      });
  };

  render() {
    const navigation = this.props.navigation;

    let Form = t.form.Form;

    return (
      <Surface style={{ flex: 1 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.Content title="Set up your Flock profile" />
        </Appbar.Header>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <Surface style={[CommonStyles.container, { elevation: 2 }]}>
            <View style={{ flex: 1, paddingHorizontal: theme.marginHorizontal * 4 }}>
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
                <Transition shared={'avatarImage'}>
                  {/*<Card style={[CommonStyles.containerItem, { overflow: 'hidden' }]}>*/}
                  <Image
                    source={{ uri: this.state.userProfileFormValues.avatar_url }}
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                  {/*</Card>*/}
                </Transition>
              </View>
            </View>
            <Button style={CommonStyles.containerItem} onPress={this._chooseAvatarImageAsync}>
              Change avatar
            </Button>
          </Surface>
          <View style={CommonStyles.container}>
            <View style={CommonStyles.containerItem}>
              <Form
                ref="userProfileForm"
                type={UserProfile}
                options={options}
                value={this.state.userProfileFormValues}
                onChange={values => this.setState({ userProfileFormValues: values })}
              />
              <Button mode="contained" onPress={this._onContinue}>
                <Subheading style={{ color: '#ffffff' }}>Continue to Flock</Subheading>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Snackbar
          visible={this.state.snackbarMessage != null}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({ snackbarMessage: null })}>
          {this.state.snackbarMessage}
        </Snackbar>
      </Surface>
    );
  }
}
