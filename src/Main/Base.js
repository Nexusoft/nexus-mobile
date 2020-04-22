import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import styled from "@emotion/native";
import { useTheme } from "emotion-theming";

import HomeIcon from "icons/home.svg";
import PayIcon from "icons/pay.svg";
import SendIcon from "icons/send.svg";
import TransactionIcon from "icons/transaction.svg";
import HomeScreen from "screens/HomeScreen";
import ReceiveScreen from "screens/ReceiveScreen";
import SendScreen from "screens/SendScreen";
import LinksScreen from "screens/LinksScreen";
import { Text } from "components/StyledText";
import Component from "components/Component";
import LogoIcon from "icons/logo-full.svg";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

const Logo = styled(LogoIcon)(({ theme }) => ({
  color: theme.primary,
  height: 23,
  width: 100,
}));

const TabBarIcon = styled(Component)(({ focused, theme }) => ({
  width: 25,
  height: 25,
  color: focused ? theme.primary : theme.mix(0.75),
}));

const TabBarLabel = styled(Text)(({ focused, theme }) => ({
  color: focused ? theme.primary : theme.mix(0.75),
  fontSize: 12,
}));

const screens = [
  {
    name: "Home",
    component: HomeScreen,
    IconComponent: HomeIcon,
  },
  {
    name: "Receive",
    component: ReceiveScreen,
    IconComponent: PayIcon,
  },
  {
    name: "Send",
    component: SendScreen,
    IconComponent: SendIcon,
  },
  {
    name: "Transactions",
    component: LinksScreen,
    IconComponent: TransactionIcon,
  },
];

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

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

export default function Base({ navigation, route }) {
  const theme = useTheme();
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    headerTitleAlign: getHeaderTitleAlign(route),
    headerTitleStyle: {
      color: theme.mix(0.75),
    },
    headerStyle: {
      backgroundColor: theme.background,
    },
  });

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        inactiveBackgroundColor: theme.background,
        activeBackgroundColor: theme.background,
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
