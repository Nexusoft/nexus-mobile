import { getMixer } from "utils/color";

const darkColor = "rgb(27,27,33)";
const lightColor = "rgb(239,240,236)";
const lightPrimaryColor = "rgb(0,183,250)";
const darkPrimaryColor = "rgb(8,154,207)";
const dangerColor = "rgb(143,36,14)";

const darkThemeMixer = getMixer(darkColor, lightColor);
export const darkTheme = {
  dark: true,
  background: darkColor,
  foreground: lightColor,
  mix: darkThemeMixer,
  primary: lightPrimaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

const lightThemeMixer = getMixer(lightColor, darkColor);
export const lightTheme = {
  dark: false,
  background: lightColor,
  foreground: darkColor,
  mix: lightThemeMixer,
  primary: darkPrimaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};
