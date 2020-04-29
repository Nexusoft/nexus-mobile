import React from "react";

export const navContainerRef = React.createRef();

export function navigate(...args) {
  navContainerRef.current?.navigate(...args);
}

export function push(...args) {
  navContainerRef.current?.dispatch(StackActions.push(...args));
}
