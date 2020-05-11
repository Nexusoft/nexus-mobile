import { DefaultTheme } from "react-native-paper";

import { getMixer, mix, fade } from "utils/color";
import memoize from "utils/memoize";

const baseDarkColor = "#121212";
const baseLightColor = "#ffffff";
const dangerColor = "#8f240e";
const primaryShades = {
  50: "#dff3fa",
  100: "#b0dff1",
  200: "#7dcae8",
  300: "#4db6df",
  400: "#29a7da",
  500: "#0099d4",
  600: "#008cc7",
  700: "#007ab4",
  800: "#0069a0",
  900: "#004b80",
};

// const darkPrimary = mix(baseDarkColor, primaryColor, 0.08);

// const darkColor = "rgb(33,33,38)";
const darkColor = baseDarkColor;
const elevatedDarkColors = {
  0: darkColor,
  1: mix(darkColor, baseLightColor, 0.05),
  2: mix(darkColor, baseLightColor, 0.07),
  3: mix(darkColor, baseLightColor, 0.08),
  4: mix(darkColor, baseLightColor, 0.09),
  6: mix(darkColor, baseLightColor, 0.11),
  8: mix(darkColor, baseLightColor, 0.12),
  12: mix(darkColor, baseLightColor, 0.14),
  16: mix(darkColor, baseLightColor, 0.15),
  24: mix(darkColor, baseLightColor, 0.16),
};
const lightColor = baseLightColor;
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

export const darkTheme = {
  dark: true,
  background: elevatedDarkColors[1],
  surface: elevatedDarkColors[4],
  foreground: fade(lightColor, 0.4),
  foregroundEmphasis: fade(lightColor, 0.17),
  foregroundDisabled: fade(lightColor, 0.62),
  // shade: getShade(getMixer(darkColor, lightColor)),
  primary: primaryShades[200],
  primaryAccent: darkColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

export const lightTheme = {
  dark: false,
  background: lightColor,
  surface: lightColor,
  foreground: fade(darkColor, 0.4),
  foregroundEmphasis: fade(darkColor, 0.17),
  foregroundDisabled: fade(darkColor, 0.62),
  // shade: getShade(getMixer(lightColor, darkColor)),
  primary: primaryShades[600],
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

export const getNavTheme = memoize((theme) => ({
  dark: theme.dark,
  colors: {
    background: theme.background,
    border: theme.background,
    card: theme.surface,
    primary: theme.primary,
    text: theme.foregroundEmphasis,
  },
}));

export const getPaperTheme = memoize((theme) => ({
  ...DefaultTheme,
  dark: theme.dark,
  mode: "adaptive",
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    background: theme.background,
    surface: theme.surface,
    text: theme.foreground,
    disabled: theme.foregroundDisabled,
    primary: theme.primary,
    accent: theme.foregroundEmphasis,
    error: theme.danger,
    placeholder: fade(theme.foreground, 0.46),
  },
  fonts: {
    thin: {
      fontFamily: "noto-sans",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "noto-sans",
      fontWeight: "normal",
    },
    regular: {
      fontFamily: "noto-sans",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "noto-sans-bold",
      fontWeight: "bold",
    },
  },
}));
