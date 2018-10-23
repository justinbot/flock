import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { FluidNavigator } from 'react-navigation-fluid-transitions';

import { transitionConfig } from 'src/constants/Transitions';
import LoadingScreen from 'src/screens/Auth/LoadingScreen';
import SettingsScreen from 'src/screens/SettingsScreen';
import ProfileEditScreen from 'src/screens/Profile/ProfileEditScreen';
import ProfileDetailScreen from 'src/screens/Profile/ProfileDetailScreen';
import AuthStack from 'src/navigation/AuthStack';
import OnboardStack from 'src/navigation/OnboardStack';
import MainTabNavigator from 'src/navigation/MainTabNavigator';

/* Routes to render on top of bottom tabs */
const AppStack = FluidNavigator(
  {
    MainTabs: {
      screen: MainTabNavigator,
    },
    Settings: SettingsScreen,
    ProfileEdit: ProfileEditScreen,
    ProfileDetail: ProfileDetailScreen,
  },
  {
    initialRouteName: 'MainTabs',
    headerMode: 'none',
    transitionConfig,
  }
);

export default createSwitchNavigator(
  {
    Loading: LoadingScreen,
    AuthStack,
    AppStack,
    OnboardStack,
  },
  {
    initialRouteName: 'Loading',
    headerMode: 'none',
  }
);
