import React from 'react';
import { createStackNavigator } from 'react-navigation';

import FriendsScreen from 'src/screens/People/FriendsScreen';

export default createStackNavigator(
  {
    Friends: FriendsScreen,
  },
  {
    initialRouteName: 'Friends',
    headerMode: 'none',
  }
);
