import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ProfileScreen from 'src/screens/Profile/ProfileScreen';

export default createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
  }
);
