import { StyleSheet } from 'react-native';

import theme from 'src/constants/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingVertical: 22,
  },
  containerItem: {
    marginVertical: theme.marginVertical,
    marginHorizontal: theme.marginHorizontal,
  },
  avatarImage: {
    borderRadius: 99999,
  },
});
