import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';
import { IconButton } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import useColorName from 'hooks/useColorName';

const IconWrapperIos = styled(TouchableOpacity)(({ size }) => ({
  margin: 6,
  width: size * 1.5,
  height: size * 1.5,
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function TouchableIcon({
  icon,
  colorName,
  sub,
  disabled,
  size,
  animated,
  ...rest
}) {
  const color = useColorName(colorName, { sub, disabled });
  const iconEl = <SvgIcon {...{ icon, colorName, sub, disabled, size }} />;
  if (Platform.OS !== 'ios') {
    return (
      <IconButton
        icon={() => iconEl}
        color={color}
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
