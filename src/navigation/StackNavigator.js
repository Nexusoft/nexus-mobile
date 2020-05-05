import React from "react";
import { TouchableNativeFeedback } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";

import SettingsScreen from "screens/SettingsScreen";
import Component from "components/Component";
import Button from "components/Button";
import { navigate } from "navigation/container";

import { screens, defaultScreen } from "./bottomTabScreens";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const HeaderButton = styled.View({
  marginHorizontal: 10,
});

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 2.5,
  color: theme.shade(1),
}));

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? defaultScreen;

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
            <Button
              delayPressIn={0}
              background={TouchableNativeFeedback.Ripple(theme.shade(1), true)}
              useForeground
              onPress={() => {
                drawerNavigation.openDrawer();
              }}
            >
              <HeaderButton>
                <HeaderIcon as={MaterialIcons} name="menu" size={25} />
              </HeaderButton>
            </Button>
          ),
          headerRight: () => (
            <Button
              delayPressIn={0}
              background={TouchableNativeFeedback.Ripple(theme.shade(1), true)}
              useForeground
              onPress={() => {
                navigate("Settings");
              }}
            >
              <HeaderButton>
                <HeaderIcon as={Ionicons} name="ios-settings" size={25} />
              </HeaderButton>
            </Button>
          ),
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
