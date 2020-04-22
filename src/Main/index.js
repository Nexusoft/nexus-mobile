import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "@emotion/native";

import Component from "components/Component";

import Base from "./Base";

const Stack = createStackNavigator();

const HeaderIcon = styled(Component)(({ theme }) => ({
  padding: 10,
  marginLeft: 5,
  color: theme.mix(0.75),
}));

export default function Main({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Base"
        component={Base}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <HeaderIcon as={MaterialIcons} name="menu" size={25} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <HeaderIcon as={Ionicons} name="ios-settings" size={25} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
