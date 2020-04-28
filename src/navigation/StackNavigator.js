import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";
import { useNavigation } from "@react-navigation/native";

import SettingsScreen from "screens/SettingsScreen";
import Component from "components/Component";
import LogoIcon from "icons/logo-full.svg";
import { navigate } from "navigation/rootNavigator";

import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 10,
  marginLeft: 5,
  color: theme.mix(0.75),
}));

const Logo = styled(LogoIcon)(({ theme }) => ({
  color: theme.primary,
  height: 23,
  width: 100,
}));

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? "Home";

const getHeaderTitle = (route) => {
  const routeName = getRouteName(route);
  switch (routeName) {
    case "Home":
      return () => <Logo />;
    case "Receive":
      return "Receive";
    case "Send":
      return "Send";
    case "Transactions":
      return "Transactions";
  }
};

const getHeaderTitleAlign = (route) =>
  getRouteName(route) === "Home" ? "center" : "left";

export default function StackNavigator({ navigation: drawerNavigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomNav"
        component={function ({ navigation: stackNavigation, route }) {
          const theme = useTheme();
          // Set the header title on the parent stack navigator depending on the
          // currently active tab. Learn more in the documentation:
          // https://reactnavigation.org/docs/en/screen-options-resolution.html
          stackNavigation.setOptions({
            headerTitle: getHeaderTitle(route),
            headerTitleAlign: getHeaderTitleAlign(route),
            headerTitleStyle: {
              color: theme.mix(0.75),
            },
            headerStyle: {
              backgroundColor: theme.background,
            },
          });

          return <BottomTabNavigator />;
        }}
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
