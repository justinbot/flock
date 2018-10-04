import React from 'react';

import { AppLoading, Asset, Constants, Font, Icon } from 'expo';
import { Feather } from '@expo/vector-icons';
import { Platform, StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as firebase from 'firebase';

import theme from 'Constants/Theme';
import AppNavigator from 'Navigation/AppNavigator';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {
  state = {
    isReady: false
  };

  componentWillMount() {
    // Initialize Firebase using configuration info
    firebase.initializeApp(Constants.manifest.extra.firebaseConfig);
  }

  render() {
    if (!this.state.isReady && !this.props.skipLoadingScreen) {
      // Display loading screen
      // See: https://docs.expo.io/versions/latest/sdk/app-loading.html
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      // Display app
      return (
        <PaperProvider theme={theme}>
          <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' && <StatusBar barStyle='default'/>}
            <AppNavigator/>
          </View>
        </PaperProvider>
      );
    }
  }

  async _loadAssetsAsync() {
    // Preload assets
    // See: https://docs.expo.io/versions/latest/guides/preloading-and-caching-assets.html

    const imageAssets = cacheImages([
    ]);

    const fontAssets = cacheFonts([
      Feather.font,
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  _handleLoadingError = error => {
    // TODO: Log to error reporting
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isReady: true });
  };
}
