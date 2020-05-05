import React from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from "react-native";

export default function NativeButton(props) {
  if (Platform.OS === "android") {
    return <TouchableNativeFeedback {...props} />;
  } else {
    return <TouchableHighlight {...props} />;
  }
}
