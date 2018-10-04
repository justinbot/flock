import React from 'react';
import { createStackNavigator } from 'react-navigation';

import LandingScreen from 'Screens/Auth/LandingScreen';
import LoginScreen from 'Screens/Auth/LoginScreen';
import RegisterScreen from 'Screens/Auth/RegisterScreen';

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
