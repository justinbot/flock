import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import theme from 'yeet/constants/Theme';
import AroundScreen from 'yeet/screens/Around/AroundScreen';
import SettingsScreen from 'yeet/screens/SettingsScreen';


export default createMaterialBottomTabNavigator(
  {
    Around: { screen: AroundScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    initialRouteName: 'Around',
    shifting: true,
    theme,
  }
);
