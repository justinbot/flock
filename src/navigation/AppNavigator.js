import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import LoadingScreen from 'Screens/Auth/LoadingScreen';
import AuthStack from 'Navigation/AuthStack';
import MainTabNavigator from 'Navigation/MainTabNavigator';


export default createSwitchNavigator(
  {
    App: MainTabNavigator,
    Auth: AuthStack,
    Loading: LoadingScreen,
  },
  {
    initialRouteName: 'Loading',
  }
);
