import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ProfileScreen from 'src/screens/Profile/ProfileScreen';
import ProfileDetailScreen from 'src/screens/Profile/ProfileDetailScreen';

export default createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Profile',
  }
);
