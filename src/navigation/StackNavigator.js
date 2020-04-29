import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";

import SettingsScreen from "screens/SettingsScreen";
import Component from "components/Component";
import { navigate } from "navigation/rootNavigator";

import { screens, DEFAULT_SCREEN } from "./bottomTabScreens";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 10,
  marginLeft: 5,
  color: theme.mix(0.75),
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
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomNav"
        component={BottomNavScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                drawerNavigation.openDrawer();
              }}
            >
              <HeaderIcon as={MaterialIcons} name="menu" size={25} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigate("Settings");
              }}
            >
              <HeaderIcon as={Ionicons} name="ios-settings" size={25} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
