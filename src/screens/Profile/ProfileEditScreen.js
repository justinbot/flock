import React from 'react';
import { Image, ImageEditor, StyleSheet, View } from 'react-native';
import { ImagePicker } from 'expo';
import {
  Button,
  Divider,
  Headline,
  Paragraph,
  RadioButton,
  Snackbar,
  Subheading,
  Surface,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import firebase from 'expo-firebase-app';
import 'expo-firebase-firestore';
import 'expo-firebase-storage';

import CommonStyles from 'src/styles/CommonStyles';

export default class extends React.Component {
  static navigationOptions = {
    title: 'Edit Profile',
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      snackbarMessage: null,
      displayName: null,
      details: null,
      avatarPath: null,
      avatarSource: null,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.state.currentUser.uid)
      .get()
      .then(userProfile => {
        // TODO handle error
        this.setState({
          displayName: userProfile.get('display_name'),
          details: userProfile.get('details'),
          avatarPath: userProfile.get('avatar_path'),
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.state.avatarPath !== prevProps.avatarPath) {
      // If avatar path changed, resolve its URL
      if (this.state.avatarPath) {
        firebase
          .storage()
          .ref(this.state.avatarPath)
          .getDownloadURL()
          .then(url => {
            this.setState({ avatarSource: url });
          });
      }
    }
  }

  _saveProfileAsync = async () => {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.state.currentUser.uid)
      .set({
        display_name: this.state.displayName,
        details: this.state.details,
        avatar_path: this.state.avatarPath,
      });
    // TODO Handle error
  };

  _uploadAvatarImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.cancelled) {
      console.log('Avatar selection cancelled');
      return;
    }

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
    let uploadedAvatarPath = `/images/${this.state.currentUser.uid}/avatars/${uuid()}`;
    try {
      let avatarRef = firebase.storage().ref(uploadedAvatarPath);

      // Upload the file
      await avatarRef.putFile(resizedUri);

      // Get url and save it to user profile
      await avatarRef.getDownloadURL();
      await this.setState({ avatarPath: uploadedAvatarPath });
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
    const { navigate } = this.props.navigation;

    return (
      <Surface style={{ flex: 1 }}>
        <Headline>TODO</Headline>
        <Divider />
        <Image
          style={[{ width: 240, height: 240 }, CommonStyles.avatarImage]}
          source={{ uri: this.state.avatarSource }}
        />
        <Button mode="contained" onPress={this._uploadAvatarImageAsync}>
          Upload Avatar Image
        </Button>
        <TextInput
          label="Name"
          mode="outlined"
          maxLength={20}
          value={this.state.displayName}
          onChangeText={displayName => this.setState({ displayName })}
        />
        <TextInput
          label="About you"
          placeholder="Add some details"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={this.state.details}
          onChangeText={details => this.setState({ details })}
        />
        <Button mode="contained" onPress={this._saveProfileAsync}>
          Save
        </Button>
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
