import { subColor, disabledColor } from 'utils/color';

export default function resolveColor(colorName, { sub, disabled }, theme) {
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
