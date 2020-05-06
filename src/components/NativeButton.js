import React from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from "react-native";
import { useTheme } from "emotion-theming";

export default function NativeButton({ borderless = true, ...rest }) {
  const theme = useTheme();
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        background={TouchableNativeFeedback.Ripple(
          theme.foregroundDisabled,
          borderless
        )}
        useForeground
        {...rest}
      />
    );
  } else {
    return <TouchableHighlight delayPressIn={0} {...rest} />;
  }
}
