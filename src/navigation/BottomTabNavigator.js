import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import styled from "@emotion/native";

import HomeIcon from "icons/home.svg";
import PayIcon from "icons/pay.svg";
import SendIcon from "icons/send.svg";
import TransactionIcon from "icons/transaction.svg";
import HomeScreen from "screens/HomeScreen";
import ReceiveScreen from "screens/ReceiveScreen";
import SendScreen from "screens/SendScreen";
import LinksScreen from "screens/LinksScreen";
import { Text } from "components/StyledText";
import AgnosticComponent from "components/AgnosticComponent";
import Colors from "constants/Colors";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      {screens.map((screen) => getScreen(screen))}
    </BottomTab.Navigator>
  );
}

const TabBarIcon = styled(AgnosticComponent)(({ focused }) => ({
  width: 25,
  height: 25,
  marginBottom: -3,
  color: focused ? Colors.tabIconSelected : Colors.tabIconDefault,
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

const getScreen = ({ name, component, IconComponent }) => (
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

const TabBarLabel = styled(Text)(({ focused, color }) => ({
  color: focused ? Colors.tabIconSelected : Colors.tabIconDefault,
  fontSize: 12,
}));

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "Home":
      return "Overview";
    case "Receive":
      return "Receive";
    case "Send":
      return "Send";
    case "Transactions":
      return "Transactions";
  }
}
