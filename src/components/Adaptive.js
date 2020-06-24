import React from 'react';
import { View as NativeView, StyleSheet } from 'react-native';
import { ScrollView as NativeScrollView } from 'react-native-gesture-handler';
import { Surface as PaperSurface, overlay } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import { subColor, disabledColor, getPaperTheme } from 'lib/theme';
import SvgIcon from 'components/SvgIcon';
import { default as MyText } from 'components/Text';
import PlainDivider from 'components/Divider';

const ColorContext = React.createContext('foreground');

const backgroundStringRegex = /^(\w+)(\^(\d))?$/;

function getBgColorName(backgroundColor, theme) {
  switch (backgroundColor) {
    case theme.background:
      return 'background';
    case theme.surface:
      return 'surface';
    case theme.primary:
      return 'primary';
    case theme.primaryVariant:
      return 'primaryVariant';
    case theme.danger:
      return 'danger';
    default:
      return null;
  }
}

function resolveBackgroundString(backgroundString) {
  const result = backgroundStringRegex.exec(backgroundString || '');
  if (!result) {
    return null;
  }
  const bgColorName = result[1];
  const elevation = result[3] && parseInt(result[3]);
  return { bgColorName, elevation };
}

function deriveColorName(backgroundString) {
  const { bgColorName } = resolveBackgroundString(backgroundString) || {};
  switch (bgColorName) {
    case 'background':
    case 'surface':
      return 'foreground';
    case 'primary':
    case 'primaryVariant':
      return 'onPrimary';
    case 'danger':
      return 'onDanger';
    default:
      return null;
  }
}

function resolveColor(colorName, modifier, theme) {
  const color = theme[colorName];
  switch (modifier) {
    case 'sub':
      return subColor(color);
    case 'disabled':
      return disabledColor(color);
    default:
      return color;
  }
}

function restoreBackgroundColor({ bgColorName, elevation }, theme) {
  const bgColor = theme[bgColorName];
  return elevation ? overlay(elevation, bgColor) : bgColor;
}

function adaptTheme(theme, backgroundString) {
  const { bgColorName, elevation } =
    resolveBackgroundString(backgroundString) || {};
  const bgColor = restoreBackgroundColor({ bgColorName, elevation }, theme);
  switch (bgColorName) {
    case 'surface':
      return { background: bgColor };
    case 'primary':
    case 'primaryVariant':
      return {
        background: bgColor,
        foreground: theme.onPrimary,
        primary: theme.onPrimary,
      };
    case 'danger':
      return {
        background: bgColor,
        foreground: theme.onDanger,
        primary: theme.onDanger,
      };
    default:
      return {};
  }
}

export const useAdaptedPaperTheme = () => {
  const theme = useTheme();
  const backgroundString = React.useContext(ColorContext);
  const adaptedPaperTheme = getPaperTheme({
    ...theme,
    ...adaptTheme(theme, backgroundString),
  });
  return adaptedPaperTheme;
};

export function backgroundProvider({
  presetBgColorName,
  elevated,
  defaultElevation,
} = {}) {
  return (Component) =>
    React.forwardRef((props, ref) => {
      const theme = useTheme();
      const style = StyleSheet.flatten(props.style);
      const bgColorName =
        presetBgColorName ||
        getBgColorName(style && style.backgroundColor, theme);
      const elevationStyle = style && style.elevation;
      const elevation = elevated
        ? '^' +
          (elevationStyle || elevationStyle === 0
            ? elevationStyle
            : defaultElevation)
        : '';
      const backgroundString = bgColorName ? bgColorName + elevation : null;
      const child = <Component ref={ref} {...props} />;
      if (backgroundString) {
        return (
          <ColorContext.Provider value={backgroundString}>
            {child}
          </ColorContext.Provider>
        );
      } else {
        return child;
      }
    });
}

export function adaptive({ modifier, colorProp } = {}) {
  return (Component) =>
    React.forwardRef((props, ref) => {
      const theme = useTheme();
      const backgroundString = React.useContext(ColorContext);
      const colorName = deriveColorName(backgroundString);
      const color = colorName && resolveColor(colorName, modifier, theme);
      if (color) {
        if (colorProp) {
          return <Component ref={ref} color={color} {...props} />;
        } else {
          return (
            <Component ref={ref} {...props} style={[{ color }, props.style]} />
          );
        }
      } else {
        return <Component ref={ref} {...props} />;
      }
    });
}

export const View = backgroundProvider()(NativeView);
export const ScrollView = backgroundProvider()(NativeScrollView);
export const Surface = backgroundProvider({
  presetBgColorName: 'surface',
  elevated: true,
  defaultElevation: 4,
})(PaperSurface);

export const Text = adaptive()(MyText);
export const SubText = adaptive({ modifier: 'sub' })(MyText);
export const DisabledText = adaptive({
  modifier: 'disabled',
})(MyText);

export const Icon = adaptive({
  modifier: null,
  colorProp: true,
})(SvgIcon);
export const SubIcon = adaptive({
  modifier: 'sub',
  colorProp: true,
})(SvgIcon);
export const DisabledIcon = adaptive({
  modifier: 'disabled',
  colorProp: true,
})(SvgIcon);

export const Divider = adaptive()(PlainDivider);
