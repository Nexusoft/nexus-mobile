import { getMixer } from "utils/color";

const darkColor = "rgb(27,27,33)";
const lightColor = "rgb(239,240,235)";
const primaryColor = "rgb(0,183,250)";
const dangerColor = "rgb(143,36,14)";

const darkThemeMixer = (ratio) => getMixer(darkColor, lightColor)(ratio);
export const darkTheme = {
  background: darkColor,
  foreground: lightColor,
  mix: darkThemeMixer,
  primary: primaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};

const lightThemeMixer = (ratio) => getMixer(lightColor, darkColor)(ratio);
export const lightTheme = {
  background: lightColor,
  foreground: darkColor,
  mix: lightThemeMixer,
  primary: primaryColor,
  primaryAccent: lightColor,
  danger: dangerColor,
  dangerAccent: lightColor,
};
