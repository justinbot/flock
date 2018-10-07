import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import theme from 'src/constants/Theme';
import AroundStack from 'src/navigation/AroundStack';
import ProfileStack from 'src/navigation/ProfileStack';
import TabBarIcon from 'src/components/TabBarIcon';

export default createMaterialBottomTabNavigator(
  {
    AroundStack: {
      screen: AroundStack,
      navigationOptions: {
        title: 'Home',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarIcon name={'feather'} focused={focused} tintColor={tintColor} />
        ),
      },
    },
    ProfileStack: {
      screen: ProfileStack,
      navigationOptions: {
        title: 'Me',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarIcon name={'user'} focused={focused} tintColor={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'AroundStack',
    shifting: true,
    theme,
  }
);
