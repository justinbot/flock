import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import LoadingScreen from 'src/screens/Auth/LoadingScreen';
import SettingsScreen from 'src/screens/SettingsScreen';
import AuthStack from 'src/navigation/AuthStack';
import MainTabNavigator from 'src/navigation/MainTabNavigator';

/* Routes to render on top of bottom tabs */
const AppStack = createStackNavigator(
  {
    MainTabs: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'MainTabs',
  }
);

export default createSwitchNavigator(
  {
    Loading: LoadingScreen,
    AuthStack: AuthStack,
    AppStack: AppStack,
  },
  {
    initialRouteName: 'Loading',
  }
);
