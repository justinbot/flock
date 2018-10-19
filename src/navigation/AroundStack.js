import React from 'react';
import { createStackNavigator } from 'react-navigation';

import AroundScreen from 'src/screens/Around/AroundScreen';

export default createStackNavigator(
  {
    Around: AroundScreen,
  },
  {
    initialRouteName: 'Around',
    headerMode: 'none',
  }
);
