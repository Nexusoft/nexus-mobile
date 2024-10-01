import React from 'react';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import { mix, fade } from 'utils/color';
import memoize from 'utils/memoize';
import { selectSetting } from 'lib/settings';

const darkColor = '#060606';
const lightColor = '#fbfbfb';
const primaryShades = {
  50: '#e1f5ff',
  100: '#b2e5fe',
  200: '#7dd4fd',
  300: '#45c4fc',
  400: '#07b7fc',
  500: '#00aafb',
  600: '#009bec',
  700: '#0088d8',
  800: '#0077c4',
  900: '#0057a1',
};
const primaryDark = '#0040ad';
const dangerShades = {
  50: '#fae9e6',
  100: '#fdccb9',
  200: '#fbaa8b',
  300: '#f98a5d',
  400: '#f87138',
  500: '#f6590e',
  600: '#eb5409',
  700: '#de4c03',
  800: '#d04500',
  900: '#b83800',
};

const elevatedDarkColors = {
  0: darkColor,
  1: mix(darkColor, lightColor, 0.05),
  2: mix(darkColor, lightColor, 0.07),
  3: mix(darkColor, lightColor, 0.08),
  4: mix(darkColor, lightColor, 0.09),
  6: mix(darkColor, lightColor, 0.11),
  8: mix(darkColor, lightColor, 0.12),
  12: mix(darkColor, lightColor, 0.14),
  16: mix(darkColor, lightColor, 0.15),
  24: mix(darkColor, lightColor, 0.16),
};
// const lightColor = "rgb(239,240,236)";
// const lightPrimaryColor = "rgb(0,183,250)";
// const darkPrimaryColor = "rgb(8,154,207)";
// const dangerColor = "rgb(143,36,14)";

// // ...
// // shade(-2)  => mix(background, foreground, 0.125)
// // shade(-1)  => mix(background, foreground, 0.25)
// // shade(0)   => mix(background, foreground, 0.5) (midground color)
// // shade(1)   => mix(background, foreground, 0.75)
// // shade(2)   => mix(background, foreground, 0.875)
// // ...
// const getShade = (mixer) => {
//   const cache = [];
//   return (index) => {
//     if (!cache[index]) {
//       const ratio = index < 0 ? 0.5 ** (-index + 1) : 1 - 0.5 ** (index + 1);
//       cache[index] = mixer(ratio);
//     }
//     return cache[index];
//   };
// };

export function subColor(color) {
  return fade(color, 0.34);
}

export function disabledColor(color) {
  return fade(color, 0.62);
}

export const darkTheme = {
  dark: true,
  background: elevatedDarkColors[2],
  foreground: lightColor,
  surface: elevatedDarkColors[4],
  primary: primaryShades[400],
  primaryVariant: primaryShades[300],
  onPrimary: darkColor,
  danger: dangerShades[400],
  onDanger: darkColor,
};

export const lightTheme = {
  dark: false,
  background: primaryShades[50],
  foreground: elevatedDarkColors[16],
  surface: lightColor,
  primary: primaryShades[400],
  primaryVariant: primaryShades[700],
  onPrimary: lightColor,
  danger: dangerShades[800],
  onDanger: lightColor,
};

const ThemeContext = React.createContext(darkTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useDerivedTheme() {
  const colorScheme = useSelector(selectSetting('colorScheme'));
  const systemColorScheme = useColorScheme();
  if (
    colorScheme === 'dark' ||
    (colorScheme === 'auto' && systemColorScheme === 'dark')
  ) {
    return darkTheme;
  }
  if (
    colorScheme === 'light' ||
    (colorScheme === 'auto' && systemColorScheme === 'light')
  ) {
    return lightTheme;
  }
  return darkTheme;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}

export const getNavTheme = memoize((theme) => ({
  dark: theme.dark,
  colors: {
    background: theme.background,
    border: theme.background,
    card: theme.surface,
    primary: theme.primary,
    text: theme.foreground,
  },
}));

export const getPaperTheme = memoize((theme) => ({
  ...(theme.dark ? DarkTheme : DefaultTheme),
  dark: theme.dark,
  mode: 'adaptive',
  roundness: 4,
  colors: {
    background: theme.background,
    backdrop: 'rgba(0,0,0,0.5)',
    surface: theme.surface,
    text: theme.foreground,
    onBackground: theme.foreground,
    onSurface: theme.foreground,
    disabled: disabledColor(theme.foreground),
    primary: theme.primary,
    accent: theme.primary,
    error: theme.danger,
    placeholder: fade(theme.foreground, 0.46),
    disabled: fade(theme.foreground, 0.74),
    notification: theme.primary,
  },
  fonts: {
    thin: {
      fontFamily: 'noto-sans',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'noto-sans',
      fontWeight: 'normal',
    },
    regular: {
      fontFamily: 'noto-sans',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'noto-sans-bold',
      fontWeight: 'bold',
    },
  },
}));
