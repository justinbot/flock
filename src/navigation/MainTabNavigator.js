import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import theme from 'src/constants/Theme';
import AroundScreen from 'src/screens/Around/AroundScreen';
import SettingsScreen from 'src/screens/SettingsScreen';

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
