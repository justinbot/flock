import { createSwitchNavigator } from 'react-navigation';

import LoadingScreen from 'yeet/screens/Auth/LoadingScreen';
import AuthStack from 'yeet/navigation/AuthStack';
import MainTabNavigator from 'yeet/navigation/MainTabNavigator';

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
