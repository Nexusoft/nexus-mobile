import * as React from "react";
import { StackActions } from "@react-navigation/native";

export const navContainerRef = React.createRef();

export function navigate(...args) {
  navContainerRef.current?.navigate(...args);
}

export function push(...args) {
  navContainerRef.current?.dispatch(StackActions.push(...args));
}
