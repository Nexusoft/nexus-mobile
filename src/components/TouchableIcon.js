import React from "react";
import { Platform, TouchableHighlight } from "react-native";
import styled from "@emotion/native";
import { IconButton } from "react-native-paper";
import { useTheme } from "emotion-theming";

import Component from "components/Component";

const IconComponent = styled(Component)(({ color, size }) => ({
  color,
  width: size,
  height: size,
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
    return <TouchableHighlight delayPressIn={0}>{iconEl}</TouchableHighlight>;
  }
}
