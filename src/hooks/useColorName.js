import { useTheme } from 'emotion-theming';
import { subColor, disabledColor } from 'utils/color';

export default function useColorName(colorName, { sub, disabled }) {
  const theme = useTheme();
  const baseColor = theme[colorName];
  return (
    baseColor &&
    (disabled
      ? disabledColor(baseColor)
      : sub
      ? subColor(baseColor)
      : baseColor)
  );
}
