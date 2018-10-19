import React from 'react';
import { BackHandler, Image, ImageEditor, Keyboard, View } from 'react-native';
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
  Surface,
  TextInput,
} from 'react-native-paper';
import { Transition } from 'react-navigation-fluid-transitions';
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { v4 as uuid } from 'uuid';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';
import 'expo-firebase-storage';

import theme from 'src/constants/Theme';
import CommonStyles from 'src/styles/CommonStyles';

// TODO Global settings
t.form.Form.i18n = {
  optional: '',
};

let Form = t.form.Form;

var UserProfile = t.struct({
  display_name: t.maybe(t.String),
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

export default class extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: null,
      userProfile: null,
      userProfileFormValues: {},
    };
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this._onBack)
    );

    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        userProfile => {
          if (userProfile.exists) {
            this.setState({
              userProfile,
              userProfileFormValues: {
                display_name: userProfile.get('display_name'),
                details: userProfile.get('details'),
                avatar_url: userProfile.get('avatar_url'),
              },
            });
          } else {
            // TODO User missing profile, could be first time
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

    // Save profile on navigate away
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      this._saveProfileAsync
    );
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _saveProfileAsync = async () => {
    // TODO Loader while saving, save on exit
    // console.log(this.refs.userProfileForm);
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

  _onBack = () => {
    Keyboard.dismiss();
    // TODO Loader
    this._saveProfileAsync().finally(() => this.props.navigation.goBack());
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Transition appear="top" disappear="top" delay>
          <View>
            <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction color={theme.colors.primary} onPress={() => this._onBack()} />
              <Appbar.Content title="Edit profile" />
            </Appbar.Header>
          </View>
        </Transition>
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
            <Form
              ref="userProfileForm"
              type={UserProfile}
              options={options}
              value={this.state.userProfileFormValues}
              onChange={values => this.setState({ userProfileFormValues: values })}
            />
            {/*<TextInput*/}
            {/*style={CommonStyles.containerItem}*/}
            {/*label="Name"*/}
            {/*mode="outlined"*/}
            {/*maxLength={20}*/}
            {/*value={this.state.formDisplayName}*/}
            {/*onChangeText={formDisplayName => this.setState({ formDisplayName })}*/}
            {/*/>*/}
            {/*<TextInput*/}
            {/*style={CommonStyles.containerItem}*/}
            {/*label="Details"*/}
            {/*placeholder="Add some details"*/}
            {/*textAlignVertical="top"*/}
            {/*mode="outlined"*/}
            {/*multiline*/}
            {/*numberOfLines={4}*/}
            {/*value={this.state.formDetails}*/}
            {/*onChangeText={formDetails => this.setState({ formDetails })}*/}
            {/*/>*/}
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
