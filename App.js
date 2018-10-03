import React from "react";

import { AppLoading, Asset, Font, Icon } from "expo";
import { Platform, StatusBar, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import theme from "Constants/Theme";
import AppNavigator from "Navigation/AppNavigator";


export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <PaperProvider theme={theme}>
          <View style={{ flex: 1 }}>
            {Platform.OS === "ios" && <StatusBar barStyle="default"/>}
            <AppNavigator/>
          </View>
        </PaperProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([]),
      Font.loadAsync({
        ...Icon.Feather.font
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
