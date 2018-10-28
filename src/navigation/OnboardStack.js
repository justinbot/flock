import React from 'react';
import { createStackNavigator } from 'react-navigation';

import OnboardProfileScreen from 'src/screens/Onboard/OnboardProfileScreen';

export default createStackNavigator(
  {
    OnboardProfile: OnboardProfileScreen,
  },
  {
    initialRouteName: 'OnboardProfile',
    headerMode: 'none',
  }
);
