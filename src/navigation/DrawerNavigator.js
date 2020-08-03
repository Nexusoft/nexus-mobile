import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

import { useTheme, getNavTheme } from 'lib/theme';
import { navContainerRef, navReadyRef } from 'lib/navigation';
import { selectLoggedIn } from 'lib/user';
import SideBar from './SideBar';
import StackNavigator from './StackNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const theme = useTheme();
  const navTheme = getNavTheme(theme);
  const loggedIn = useSelector(selectLoggedIn);

  return (
    <NavigationContainer
      ref={navContainerRef}
      onReady={() => {
        navReadyRef.current = true;
      }}
      theme={navTheme}
    >
      <Drawer.Navigator
        hideStatusBar={false}
        drawerContent={(props) => <SideBar {...props} />}
        sceneContainerStyle={{
          backgroundColor: theme.dark ? undefined : theme.primary,
        }}
        edgeWidth={loggedIn ? undefined : 0}
      >
        <Drawer.Screen name="StackNav" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
