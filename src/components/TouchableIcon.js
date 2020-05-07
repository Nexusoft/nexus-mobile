import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import styled from "@emotion/native";
import { IconButton } from "react-native-paper";
import { useTheme } from "emotion-theming";

import Component from "components/Component";

const IconComponent = styled(Component)(({ color, size }) => ({
  color,
  width: size,
  height: size,
}));

const IconWrapperIos = styled(TouchableOpacity)(({ size }) => ({
  margin: 6,
  width: size * 1.5,
  height: size * 1.5,
}));

export default function TouchableIcon({
  icon,
  color,
  size,
  disabled,
  animated,
  ...rest
}) {
  const theme = useTheme();

  const iconColor =
    (typeof color === "string" ? theme[color] : color) || theme.foreground;
  const iconEl = <IconComponent as={icon} color={iconColor} size={size} />;
  if (Platform.OS === "android") {
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
