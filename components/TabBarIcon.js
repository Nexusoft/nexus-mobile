import { Ionicons } from "@expo/vector-icons";
import * as React from "react";

import Colors from "../constants/Colors";

export default function TabBarIcon(props) {
  if (props.svg) {
    const Component = props.component;
    return (
      <Component
        width={25}
        height={25}
        style={{
          marginBottom: -3,
          color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault,
        }}
      />
    );
  }
  return (
    <Ionicons
      name={props.name}
      size={25}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
