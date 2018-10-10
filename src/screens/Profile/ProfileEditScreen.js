import React from 'react';
import { Image, ImageEditor, View } from 'react-native';
import { ImagePicker } from 'expo';
import { Appbar, Button, Card, Divider, Snackbar, Subheading, TextInput } from 'react-native-paper';
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

  _uploadAvatarImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

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

    this.setState({
      snackbarMessage: 'Uploading avatar...',
    });

    // Upload avatar with a unique name
    let uploadedAvatarPath = `/images/${firebase.auth().currentUser.uid}/avatars/${uuid()}`;
    try {
      let avatarRef = firebase.storage().ref(uploadedAvatarPath);

      // Upload the file
      await avatarRef.putFile(resizedUri);

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

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#ffffff' }}>
          <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit profile" />
        </Appbar.Header>
        <KeyboardAwareScrollView>
          <View style={CommonStyles.container}>
            <Card style={[CommonStyles.containerItem, { aspectRatio: 1 }]}>
              <Card.Cover style={{ height: '100%' }} source={{ uri: this.state.formAvatarUrl }} />
            </Card>
            <Button
              mode="outlined"
              style={CommonStyles.containerItem}
              onPress={this._uploadAvatarImageAsync}>
              Change avatar
            </Button>
            <Divider />
            <Subheading
              style={[CommonStyles.containerItem, { fontWeight: 'bold', marginBottom: 0 }]}>
              Name
            </Subheading>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <TextInput
                  mode="outlined"
                  maxLength={20}
                  value={this.state.formDisplayName}
                  onChangeText={formDisplayName => this.setState({ formDisplayName })}
                />
              </Card.Content>
            </Card>
            <Subheading
              style={[CommonStyles.containerItem, { fontWeight: 'bold', marginBottom: 0 }]}>
              About you
            </Subheading>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <TextInput
                  placeholder="Add some details"
                  textAlignVertical="top"
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  value={this.state.formDetails}
                  onChangeText={formDetails => this.setState({ formDetails })}
                />
              </Card.Content>
            </Card>
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
