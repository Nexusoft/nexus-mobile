import React from "react";
import { TouchableNativeFeedback } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";

import SettingsScreen from "screens/SettingsScreen";
import Component from "components/Component";
import NativeButton from "components/NativeButton";
import { navigate } from "navigation/container";

import { screens, defaultScreen } from "./bottomTabScreens";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const ButtonContent = styled.View({
  marginHorizontal: 10,
});

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 2.5,
  color: theme.foregroundEmphasis,
}));

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? defaultScreen;

function BottomNavScreen({ navigation: stackNavigation, route }) {
  const routeName = getRouteName(route);
  const screen = screens.find((screen) => screen.name === routeName);
  stackNavigation.setOptions(screen?.stackOptions);
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
            <NativeButton
              delayPressIn={0}
              background={TouchableNativeFeedback.Ripple(
                theme.foreground,
                true
              )}
              useForeground
              onPress={() => {
                drawerNavigation.openDrawer();
              }}
            >
              <ButtonContent>
                <HeaderIcon as={MaterialIcons} name="menu" size={25} />
              </ButtonContent>
            </NativeButton>
          ),
          headerRight: () => (
            <NativeButton
              delayPressIn={0}
              background={TouchableNativeFeedback.Ripple(
                theme.foreground,
                true
              )}
              useForeground
              onPress={() => {
                navigate("Settings");
              }}
            >
              <ButtonContent>
                <HeaderIcon as={Ionicons} name="ios-settings" size={25} />
              </ButtonContent>
            </NativeButton>
          ),
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
