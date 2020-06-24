import { shadow } from 'react-native-paper';

export const flatHeader = (theme) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
  elevation: 0,
  ...shadow(0),
});
