import { getMixer } from "utils/color";

const darkColor = "rgb(27,27,33)";
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
