import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";

import { DEFAULT_SCREEN, screens } from "./bottomTabScreens";
import { Text } from "components/StyledText";
import Component from "components/Component";

const BottomTab = createBottomTabNavigator();

const TabBarIcon = styled(Component)(({ focused, theme }) => ({
  width: 25,
  height: 25,
  color: focused ? theme.primary : theme.mix(0.75),
}));

const TabBarLabel = styled(Text)(({ focused, theme }) => ({
  color: focused ? theme.primary : theme.mix(0.75),
  fontSize: 12,
}));

const renderScreen = ({ name, component, IconComponent }) => (
  <BottomTab.Screen
    key={name}
    name={name}
    component={component}
    options={{
      title: name,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon as={IconComponent} focused={focused} />
      ),
      tabBarLabel: ({ focused, color }) => (
        <TabBarLabel {...{ focused, color }}>{name}</TabBarLabel>
      ),
    }}
  />
);

export default function BottomTabNavigator() {
  const theme = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName={DEFAULT_SCREEN}
      tabBarOptions={{
        // inactiveBackgroundColor: theme.background,
        // activeBackgroundColor: theme.background,
        style: {
          borderTopWidth: 0,
          // borderTopColor: theme.mix(0.125),
        },
      }}
    >
      {screens.map((screen) => renderScreen(screen))}
    </BottomTab.Navigator>
  );
}
