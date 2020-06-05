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
import SvgIcon from 'components/SvgIcon';
import PlainDivider from 'components/Divider';

function getColorName(viewStyle, theme) {
  const style = StyleSheet.flatten(viewStyle);
  switch (style && style.backgroundColor) {
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

export function BackgroundComponentFactory(Component, presetColorName) {
  return React.forwardRef((props, ref) => {
    const theme = useTheme();
    const colorName = presetColorName || getColorName(props.style, theme);
    const child = <Component ref={ref} {...props} />;
    if (colorName) {
      return (
        <ColorContext.Provider value={colorName}>{child}</ColorContext.Provider>
      );
    } else {
      return child;
    }
  });
}

export function ForegroundComponentFactory(Component, modifier, colorProp) {
  return React.forwardRef((props, ref) => {
    const theme = useTheme();
    const colorName = React.useContext(ColorContext);
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

const MyText = styled(NativeText)(({ mono, bold }) => ({
  fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
  fontWeight: bold ? 'bold' : 'normal',
}));

export const View = BackgroundComponentFactory(NativeView);
export const ScrollView = BackgroundComponentFactory(NativeScrollView);
export const Surface = BackgroundComponentFactory(PaperSurface, 'foreground');

export const Text = ForegroundComponentFactory(MyText);
export const SubText = ForegroundComponentFactory(MyText, 'sub');
export const DisabledText = ForegroundComponentFactory(MyText, 'disabled');

export const Icon = ForegroundComponentFactory(SvgIcon, null, true);
export const SubIcon = ForegroundComponentFactory(SvgIcon, 'sub', true);
export const DisabledIcon = ForegroundComponentFactory(
  SvgIcon,
  'disabled',
  true
);

export const Divider = ForegroundComponentFactory(PlainDivider);
