import { createStackNavigator } from 'react-navigation';
// import { FluidNavigator } from 'react-navigation-fluid-transitions';

// import { transitionConfig } from 'src/constants/Transitions';
import LandingScreen from 'src/screens/Auth/LandingScreen';
import LoginScreen from 'src/screens/Auth/LoginScreen';
import RegisterScreen from 'src/screens/Auth/RegisterScreen';

export default createStackNavigator(
  {
    Landing: LandingScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    // TODO: Onboard: OnboardScreen
  },
  {
    initialRouteName: 'Landing',
    headerMode: 'none',
    // transitionConfig,
  }
);
