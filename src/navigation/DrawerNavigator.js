import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'emotion-theming';

import { getNavTheme } from 'lib/theme';

import { backgroundProvider } from 'lib/adaptive';
import { navContainerRef } from 'lib/navigation';
import SideMenu from './SideMenu';
import StackNavigator from './StackNavigator';

const AdaptiveSideMenu = backgroundProvider({
  presetBgColorName: 'surface',
})(SideMenu);

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const theme = useTheme();
  const navTheme = getNavTheme(theme);
  return (
    <NavigationContainer ref={navContainerRef} theme={navTheme}>
      <Drawer.Navigator
        hideStatusBar={false}
        drawerContent={(props) => <AdaptiveSideMenu {...props} />}
        sceneContainerStyle={{
          backgroundColor: theme.dark ? undefined : theme.primary,
        }}
      >
        <Drawer.Screen name="StackNav" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
