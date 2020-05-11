import React from "react";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ApplicationSettings from "./ApplicationSettings";
import CoreSettings from "./CoreSettings";

const TopTab = createMaterialTopTabNavigator();

export default function SettingsScreen() {
  return (
    <TopTab.Navigator
      initialRouteName="ApplicationSettings"
      backBehavior="history"
    >
      <TopTab.Screen
        name="ApplicationSettings"
        component={ApplicationSettings}
        options={{
          title: "Application",
        }}
      />
      <TopTab.Screen
        name="CoreSettings"
        component={CoreSettings}
        options={{
          title: "Core",
        }}
      />
    </TopTab.Navigator>
  );
}
