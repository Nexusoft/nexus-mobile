import { DefaultTheme } from "react-native-paper";

import { getMixer } from "utils/color";
import memoize from "utils/memoize";

const darkColor = "rgb(33,33,38)";
const lightColor = "rgb(239,240,236)";
const lightPrimaryColor = "rgb(0,183,250)";
const darkPrimaryColor = "rgb(8,154,207)";
const dangerColor = "rgb(143,36,14)";

// ...
// shade(-2)  => mix(background, foreground, 0.125)
// shade(-1)  => mix(background, foreground, 0.25)
// shade(0)   => mix(background, foreground, 0.5) (midground color)
// shade(1)   => mix(background, foreground, 0.75)
// shade(2)   => mix(background, foreground, 0.875)
// ...
const getShade = (mixer) => {
  const cache = [];
  return (index) => {
    if (!cache[index]) {
      const ratio = index < 0 ? 0.5 ** (-index + 1) : 1 - 0.5 ** (index + 1);
      cache[index] = mixer(ratio);
    }
    return cache[index];
  };
};

export const darkTheme = {
  dark: true,
  background: darkColor,
  foreground: lightColor,
  shade: getShade(getMixer(darkColor, lightColor)),
  primary: lightPrimaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

export const lightTheme = {
  dark: false,
  background: lightColor,
  foreground: darkColor,
  shade: getShade(getMixer(lightColor, darkColor)),
  primary: darkPrimaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

export const getNavTheme = memoize((theme) => ({
  dark: theme.dark,
  colors: {
    background: theme.background,
    border: theme.background,
    card: theme.shade(-4),
    primary: theme.primary,
    text: theme.shade(1),
  },
}));

export const getPaperTheme = memoize((theme) => ({
  ...DefaultTheme,
  dark: theme.dark,
  mode: "adaptive",
  colors: {
    background: theme.background,
    accent: theme.shade(1),
    primary: theme.primary,
    error: theme.danger,
  },
}));
