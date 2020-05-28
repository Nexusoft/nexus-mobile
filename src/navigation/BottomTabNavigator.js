import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import styled from '@emotion/native';

import Component from 'components/Component';
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
  return (
    <BottomTab.Navigator initialRouteName={defaultScreen} shifting={false}>
      {screens.map((screen) => renderScreen(screen))}
    </BottomTab.Navigator>
  );
}
