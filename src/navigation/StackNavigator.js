import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TouchableIcon from "components/TouchableIcon";
import SettingsScreen from "screens/SettingsScreen";
import TokensScreen from "screens/TokensScreen";
import NamesScreen from "screens/NamesScreen";
import NamespacesScreen from "screens/NamespacesScreen";
import AssetsScreen from "screens/AssetsScreen";
import { navigate } from "navigation/container";
import MenuIcon from "icons/menu.svg";
import SettingsIcon from "icons/settings.svg";

import { screens, defaultScreen } from "./bottomTabScreens";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? defaultScreen;

function BottomNavScreen({ navigation: stackNavigation, route }) {
  const routeName = getRouteName(route);
  const screen = screens.find((screen) => screen.name === routeName);
  stackNavigation.setOptions(screen?.stackOptions);
  return <BottomTabNavigator />;
}

export default function StackNavigator({ navigation: drawerNavigation }) {
  return (
    <Stack.Navigator initialRouteName="BottomNav">
      <Stack.Screen
        name="BottomNav"
        component={BottomNavScreen}
        options={{
          headerLeft: () => (
            <TouchableIcon
              icon={MenuIcon}
              color="foregroundEmphasis"
              size={25}
              onPress={() => {
                drawerNavigation.openDrawer();
              }}
            />
          ),
          headerRight: () => (
            <TouchableIcon
              icon={SettingsIcon}
              color="foregroundEmphasis"
              size={25}
              onPress={() => {
                navigate("Settings");
              }}
            />
          ),
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Tokens" component={TokensScreen} />
      <Stack.Screen name="Names" component={NamesScreen} />
      <Stack.Screen name="Namespaces" component={NamespacesScreen} />
      <Stack.Screen name="Assets" component={AssetsScreen} />
    </Stack.Navigator>
  );
}
