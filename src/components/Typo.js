import React from 'react';
import {
  View as NativeView,
  Text as NativeText,
  StyleSheet,
} from 'react-native';
import styled from '@emotion/native';
import { ScrollView as NativeScrollView } from 'react-native-gesture-handler';
import { Surface as PaperSurface } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import { subColor, disabledColor } from 'lib/theme';
import ColorContext from 'lib/ColorContext';
import { fade } from 'utils/color';
import SvgIcon from 'components/SvgIcon';

function getColorName(viewStyle, theme) {
  const style = StyleSheet.flatten(viewStyle);
  switch (style && style.background) {
    case theme.background:
      return 'foreground';
    case theme.surface:
      return 'foreground';
    case theme.primary:
      return 'onPrimary';
    case theme.primaryVariant:
      return 'onPrimary';
    case theme.danger:
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

export function BackgroundFactory(Component, presetColorName) {
  return (props) => {
    const theme = useTheme();
    const colorName = presetColorName || getColorName(props.style, theme);
    const child = <Component {...props} />;
    if (colorName) {
      return (
        <ColorContext.Provider value={colorName}>{child}</ColorContext.Provider>
      );
    } else {
      return child;
    }
  };
}

export const View = BackgroundFactory(NativeView);
export const ScrollView = BackgroundFactory(NativeScrollView);
export const Surface = BackgroundFactory(PaperSurface, 'foreground');

export function ForegroundFactory(Component, modifier) {
  return (props) => {
    const theme = useTheme();
    const colorName = React.useContext(ColorContext);
    const color = colorName && resolveColor(colorName, modifier, theme);
    if (color) {
      return <Component {...props} style={[{ color }, props.style]} />;
    } else {
      return <Component {...props} />;
    }
  };
}

const MyText = styled(NativeText)(({ mono, bold }) => ({
  fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
  fontWeight: bold ? 'bold' : 'normal',
}));

export const Text = ForegroundFactory(MyText);
export const SubText = ForegroundFactory(MyText, 'sub');
export const DisabledText = ForegroundFactory(MyText, 'disabled');

export const Icon = ForegroundFactory(SvgIcon);
export const SubIcon = ForegroundFactory(SvgIcon, 'sub');
export const DisabledIcon = ForegroundFactory(SvgIcon, 'disabled');

export const Divider = ({ vertical, inset, spacing }) => {
  const theme = useTheme();
  const colorName = React.useContext(ColorContext);
  const color = fade(theme[colorName] || theme.foreground, 0.8);
  return (
    <NativeView
      style={[
        {
          backgroundColor: color,
        },
        vertical && {
          width: 1,
          marginVertical: inset,
          marginHorizontal: spacing,
        },
        !vertical && {
          height: 1,
          marginHorizontal: inset,
          marginVertical: spacing,
        },
      ]}
    />
  );
};
