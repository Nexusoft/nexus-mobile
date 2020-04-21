import * as React from "react";
import { Text as NativeText } from "react-native";

export function Text(props) {
  return (
    <NativeText {...props} style={[{ fontFamily: "noto-sans" }, props.style]} />
  );
}

export function MonoText(props) {
  return <NativeText {...props} style={[props.style, {}]} />;
}
