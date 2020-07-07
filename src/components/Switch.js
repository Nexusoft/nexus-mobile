import React from 'react';
import { Switch as PaperSwitch } from 'react-native-paper';
import { useTheme } from 'lib/theme';

export default function Switch(props) {
  const theme = useTheme();
  return <PaperSwitch color={theme.primary} {...props} />;
}
