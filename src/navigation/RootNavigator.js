import * as React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { useTheme } from "emotion-theming";

import memoize from "utils/memoize";

import DrawerNavigator from "./DrawerNavigator";

export const navContainerRef = React.createRef();

export function navigate(...args) {
  navContainerRef.current?.navigate(...args);
}

export function push(...args) {
  navContainerRef.current?.dispatch(StackActions.push(...args));
}

const getNavTheme = memoize((theme) => ({
  dark: theme.dark,
  colors: {
    background: theme.background,
    border: theme.background,
    card: theme.mix(0.0625),
    primary: theme.primary,
    text: theme.mix(0.75),
  },
}));

export default function RootNavigator({ initialNavigationState }) {
  const theme = useTheme();
  const navTheme = getNavTheme(theme);
  return (
    <NavigationContainer
      ref={navContainerRef}
      initialState={initialNavigationState}
      theme={navTheme}
    >
      <DrawerNavigator />
    </NavigationContainer>
  );
}
