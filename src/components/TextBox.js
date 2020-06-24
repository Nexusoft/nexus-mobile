import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

export default function TextBox(props) {
  const theme = useTheme();
  return (
    <PaperTextInput
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      {...props}
    />
  );
}
