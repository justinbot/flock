import { createSwitchNavigator } from 'react-navigation';

import LoadingScreen from 'src/screens/Auth/LoadingScreen';
import AuthStack from 'src/navigation/AuthStack';
import MainTabNavigator from 'src/navigation/MainTabNavigator';

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
