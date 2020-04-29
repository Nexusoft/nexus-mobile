import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { useTheme } from "emotion-theming";

import memoize from "utils/memoize";

import DrawerNavigator from "./DrawerNavigator";
import { navContainerRef } from "./container";

const getNavTheme = memoize((theme) => ({
  dark: theme.dark,
  colors: {
    background: theme.background,
    border: theme.background,
    card: theme.shade(-4),
    primary: theme.primary,
    text: theme.shade(1),
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
