import { PixelRatio, StyleSheet } from 'react-native';

import theme from 'src/constants/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.marginVertical * 2,
    paddingBottom: theme.marginVertical,
  },
  containerItem: {
    marginVertical: theme.marginVertical,
    marginHorizontal: theme.marginHorizontal,
  },
});
