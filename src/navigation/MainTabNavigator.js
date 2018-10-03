import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import theme from 'Constants/Theme';
import AroundScreen from 'Screens/Around/AroundScreen';
import SettingsScreen from 'Screens/SettingsScreen';


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
