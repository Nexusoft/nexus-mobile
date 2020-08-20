import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { ThemeProvider, useDerivedTheme, getPaperTheme } from 'lib/theme';

export default function ThemeContainer({ children }) {
  const theme = useDerivedTheme();
  return (
    <ThemeProvider value={theme}>
      <PaperProvider theme={getPaperTheme(theme)}>{children}</PaperProvider>
    </ThemeProvider>
  );
}
