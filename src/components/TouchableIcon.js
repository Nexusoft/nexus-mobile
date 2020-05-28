import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';
import { IconButton } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import SvgIcon from 'components/SvgIcon';
import resolveColor from 'utils/resolveColor';

const IconWrapperIos = styled(TouchableOpacity)(({ size }) => ({
  margin: 6,
  width: size * 1.5,
  height: size * 1.5,
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function TouchableIcon({
  icon,
  color,
  colorName,
  sub,
  disabled,
  size,
  animated,
  ...rest
}) {
  const theme = useTheme();
  const iconColor = color || resolveColor(colorName, { sub, disabled }, theme);
  const iconEl = (
    <SvgIcon {...{ icon, color, colorName, sub, disabled, size }} />
  );
  if (Platform.OS !== 'ios') {
    return (
      <IconButton
        icon={() => iconEl}
        color={iconColor}
        size={size}
        disabled={disabled}
        animated={animated}
        {...rest}
      />
    );
  } else {
    return (
      <IconWrapperIos delayPressIn={0} size={size} {...rest}>
        <View>{iconEl}</View>
      </IconWrapperIos>
    );
  }
}
