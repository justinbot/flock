import React from 'react';
import { Image, ImageEditor, View } from 'react-native';
import { ImagePicker } from 'expo';
import { Appbar, Button, Card, Snackbar, Subheading, TextInput } from 'react-native-paper';
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
    const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#ffffff' }}>
          <Appbar.BackAction color={theme.colors.primary} onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit profile" />
          {/*<Appbar.Action icon="more-vert" onPress={this._onMore} />*/}
        </Appbar.Header>
        <KeyboardAwareScrollView>
          <View style={CommonStyles.container}>
            <Image
              style={[
                CommonStyles.containerItem,
                CommonStyles.avatarImage,
                { width: 200, height: 200, alignSelf: 'center' },
              ]}
              source={{ uri: this.state.avatarUrl }}
            />
            <Button
              mode="outlined"
              style={CommonStyles.containerItem}
              onPress={this._uploadAvatarImageAsync}>
              Change avatar
            </Button>
            <Subheading style={[CommonStyles.containerItem, { fontWeight: 'bold', marginBottom: 0 }]}>Name</Subheading>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <TextInput
                  // label="Name"
                  mode="outlined"
                  maxLength={20}
                  value={this.state.displayName}
                  onChangeText={displayName => this.setState({ displayName })}
                />
              </Card.Content>
            </Card>
            <Subheading style={[CommonStyles.containerItem, { fontWeight: 'bold', marginBottom: 0 }]}>About you</Subheading>
            <Card style={CommonStyles.containerItem}>
              <Card.Content>
                <TextInput
                  // label="About you"
                  placeholder="Add some details"
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  value={this.state.details}
                  onChangeText={details => this.setState({ details })}
                />
              </Card.Content>
            </Card>
            <Snackbar
              visible={this.state.snackbarMessage != null}
              duration={Snackbar.DURATION_SHORT}
              onDismiss={() => this.setState({ snackbarMessage: null })}>
              {this.state.snackbarMessage}
            </Snackbar>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
