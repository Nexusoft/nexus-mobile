import React from "react";
import { DefaultTheme, Button } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";

import SettingsScreen from "screens/SettingsScreen";
import Component from "components/Component";
import { navigate } from "navigation/container";

import { screens, DEFAULT_SCREEN } from "./bottomTabScreens";
import BottomTabNavigator from "./BottomTabNavigator";

console.log(DefaultTheme);

const Stack = createStackNavigator();

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 10,
  marginLeft: 5,
  color: theme.shade(1),
}));

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? DEFAULT_SCREEN;

function BottomNavScreen({ navigation: stackNavigation, route }) {
  const routeName = getRouteName(route);
  const screen = screens.find((screen) => screen.name === routeName);
  stackNavigation.setOptions(screen?.options);
  return <BottomTabNavigator />;
}

export default function StackNavigator({ navigation: drawerNavigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomNav"
        component={BottomNavScreen}
        options={{
          headerLeft: () => (
            <Button
              mode="text"
              onPress={() => {
                drawerNavigation.openDrawer();
              }}
            >
              <HeaderIcon as={MaterialIcons} name="menu" size={25} />
            </Button>
          ),
          headerRight: () => (
            <Button
              mode="text"
              onPress={() => {
                navigate("Settings");
              }}
            >
              <HeaderIcon as={Ionicons} name="ios-settings" size={25} />
            </Button>
          ),
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
