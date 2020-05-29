import React from 'react';
import { Switch as PaperSwitch } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

export default function Switch(props) {
  const theme = useTheme();
  return <PaperSwitch color={theme.primary} {...props} />;
}
