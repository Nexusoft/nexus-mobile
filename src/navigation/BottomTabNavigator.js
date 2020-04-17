import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import HomeIcon from "icons/home.svg";
import PayIcon from "icons/pay.svg";
import SendIcon from "icons/send.svg";
import TransactionIcon from "icons/transaction.svg";
import TabBarIcon from "components/TabBarIcon";
import HomeScreen from "screens/HomeScreen";
import ReceiveScreen from "screens/ReceiveScreen";
import SendScreen from "screens/SendScreen";
import LinksScreen from "screens/LinksScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Overview",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon svg component={HomeIcon} focused={focused} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{
          title: "Receive",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon svg component={PayIcon} focused={focused} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Send"
        component={SendScreen}
        options={{
          title: "Send",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon svg component={SendIcon} focused={focused} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Transactions"
        component={LinksScreen}
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon svg component={TransactionIcon} focused={focused} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

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
