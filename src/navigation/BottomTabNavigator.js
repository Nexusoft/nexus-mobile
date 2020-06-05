import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { shadow, TouchableRipple } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import SvgIcon from 'components/SvgIcon';
import { fade } from 'utils/color';
import { defaultScreen, screens } from './bottomTabScreens';

const BottomTab = createBottomTabNavigator();

const renderScreen = ({ name, component, icon }) => (
  <BottomTab.Screen
    key={name}
    name={name}
    component={component}
    options={{
      title: name,
      tabBarIcon: ({ color }) => (
        <SvgIcon icon={icon} size={24} color={color} />
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
      tabBarOptions={{
        activeTintColor: theme.foreground,
        inactiveTintColor: fade(theme.foreground, 0.5),
        style: { paddingTop: 5, elevation: 4, ...shadow(4) },
        labelStyle: { marginBottom: 5 },
      }}
      screenOptions={{
        tabBarButton: (props) => {
          return <TouchableRipple {...props} />;
        },
      }}
    >
      {screens.map((screen) => renderScreen(screen))}
    </BottomTab.Navigator>
  );
}
