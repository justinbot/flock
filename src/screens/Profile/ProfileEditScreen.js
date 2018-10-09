import React from 'react';
import {
  BackHandler,
  Image,
  ImageEditor,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { ImagePicker } from 'expo';
import {
  Button,
  Card,
  Divider,
  Headline,
  Paragraph,
  RadioButton,
  Snackbar,
  Subheading,
  Surface,
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

  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      snackbarMessage: null,
      displayName: null,
      details: null,
      avatarUrl: null,
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
          avatarUrl: userProfile.get('avatar_url'),
        });
      });

    // Save changes on navigate back
    // this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
    //   this._onNavigateBack()
    // );
  }

  // componentWillUnmount() {
  //   this._willBlurSubscription && this._willBlurSubscription.remove();
  // }

  // _onNavigateBack() {
  //   // TODO Loader while saving
  //   this._saveProfileAsync();
  // }

  _saveProfileAsync = async () => {
    // TODO Loader while saving, save on exit or change rather than button
    return firebase
      .firestore()
      .collection('users')
      .doc(this.state.currentUser.uid)
      .set(
        {
          display_name: this.state.displayName,
          details: this.state.details,
          avatar_url: this.state.avatarUrl,
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
      let uploadedAvatarUrl = await avatarRef.getDownloadURL();
      await this.setState({ avatarUrl: uploadedAvatarUrl });
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
      <View style={{ flex: 1 }}>
        <Headline>TODO</Headline>
        <Divider />
        <Image
          style={[{ width: 200, height: 200 }, CommonStyles.avatarImage]}
          source={{ uri: this.state.avatarUrl }}
        />
        <Button mode="outlined" onPress={this._uploadAvatarImageAsync}>
          Change avatar
        </Button>
        <Card>
          <Card.Content>
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
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={this._saveProfileAsync}>
          Save changes
        </Button>
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
