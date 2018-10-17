import { DefaultTheme } from 'react-native-paper';

export default {
  ...DefaultTheme,
  roundness: 12,
  marginHorizontal: 16,
  marginVertical: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#50b38f',
    primaryDark: '#138362',
    primaryLight: '#83e6bf',
    secondary: '#ef957d',
    secondaryDark: '#cbba83',
    secondaryLight: '#ffffe5',
    // primary
    // accent
    // background
    // surface
    // text
    // placeholder
    // backdrop
  },
  fonts: {
    alternateMedium: 'lato-bold',
  },
};
