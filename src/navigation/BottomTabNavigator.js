import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import styled from "@emotion/native";

import { DEFAULT_SCREEN, screens } from "./bottomTabScreens";
import { Text } from "components/StyledText";
import Component from "components/Component";

const BottomTab = createBottomTabNavigator();

const TabBarIcon = styled(Component)(({ focused, theme }) => ({
  width: 25,
  height: 25,
  color: focused ? theme.primary : theme.shade(1),
}));

const TabBarLabel = styled(Text)(({ focused, theme }) => ({
  color: focused ? theme.primary : theme.shade(1),
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
  return (
    <BottomTab.Navigator initialRouteName={DEFAULT_SCREEN}>
      {screens.map((screen) => renderScreen(screen))}
    </BottomTab.Navigator>
  );
}
