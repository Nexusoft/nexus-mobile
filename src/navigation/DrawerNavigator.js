import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import StackNavigator from "./StackNavigator";
import SideMenu from "./SideMenu";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SideMenu {...props} />}>
      <Drawer.Screen name="StackNav" component={StackNavigator} />
    </Drawer.Navigator>
  );
}
