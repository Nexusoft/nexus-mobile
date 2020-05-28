import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import { shadow } from 'react-native-paper';

import Component from 'components/Component';
import { subColor } from 'utils/color';
import { defaultScreen, screens } from './bottomTabScreens';

const BottomTab = createMaterialBottomTabNavigator();

const TabBarIcon = styled(Component)({
  width: 24,
  height: 24,
});

const renderScreen = ({ name, component, IconComponent }) => (
  <BottomTab.Screen
    key={name}
    name={name}
    component={component}
    options={{
      title: name,
      tabBarIcon: ({ color }) => (
        <TabBarIcon as={IconComponent} style={{ color }} />
      ),
      tabBarLabel: name,
    }}
  />
);

export default function BottomTabNavigator() {
  const theme = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName={defaultScreen}
      shifting={false}
      barStyle={
        {
          // elevation: 1,
          // ...shadow(1),
        }
      }
    >
      {screens.map((screen) => renderScreen(screen))}
    </BottomTab.Navigator>
  );
}
