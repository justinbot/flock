import React from 'react';
import { createStackNavigator } from 'react-navigation';

import LandingScreen from 'yeet/screens/Auth/LandingScreen';
import LoginScreen from 'yeet/screens/Auth/LoginScreen';
import RegisterScreen from 'yeet/screens/Auth/RegisterScreen';

export default createStackNavigator(
  {
    Landing: {
      screen: LandingScreen,
      navigationOptions: {
        header: null,
      },
    },
    Login: LoginScreen,
    Register: RegisterScreen,
    // TODO: Onboard: OnboardScreen
  },
  {
    initialRouteName: 'Landing',
  }
);
