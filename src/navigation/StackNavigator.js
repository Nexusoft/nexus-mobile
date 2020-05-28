import React from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { shadow } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import TouchableIcon from 'components/TouchableIcon';
import SettingsScreen from 'screens/SettingsScreen';
import TokensScreen from 'screens/TokensScreen';
import NamesScreen from 'screens/NamesScreen';
import NamespacesScreen from 'screens/NamespacesScreen';
import AssetsScreen from 'screens/AssetsScreen';
import { navigate } from 'lib/navigation';
import MenuIcon from 'icons/menu.svg';
import SettingsIcon from 'icons/settings.svg';

import { screens, defaultScreen } from './bottomTabScreens';
import BottomTabNavigator from './BottomTabNavigator';
import { clockRunning } from 'react-native-reanimated';

const Stack = createStackNavigator();

const getRouteName = (route) =>
  route.state?.routes[route.state.index]?.name ?? defaultScreen;

function BottomNavScreen({ navigation: stackNavigation, route }) {
  const theme = useTheme();
  const routeName = getRouteName(route);
  const screen = screens.find((screen) => screen.name === routeName);
  const stackOptions =
    typeof screen.stackOptions === 'function'
      ? screen.stackOptions(theme)
      : screen.stackOptions;
  stackNavigation.setOptions(stackOptions);
  return <BottomTabNavigator />;
}

export default function StackNavigator({ navigation: drawerNavigation }) {
  const theme = useTheme();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.dark ? '#000' : theme.primaryVariant}
      />
      <Stack.Navigator
        initialRouteName="BottomNav"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.dark ? theme.surface : theme.primary,
            elevation: 4,
            ...shadow(3),
          },
          headerTintColor: theme.dark ? theme.foreground : theme.onPrimary,
        }}
      >
        <Stack.Screen
          name="BottomNav"
          component={BottomNavScreen}
          options={{
            headerLeft: ({ tintColor }) => (
              <TouchableIcon
                icon={MenuIcon}
                color={tintColor}
                size={25}
                onPress={() => {
                  drawerNavigation.openDrawer();
                }}
              />
            ),
            headerRight: ({ tintColor }) => (
              <TouchableIcon
                icon={SettingsIcon}
                color={tintColor}
                size={25}
                onPress={() => {
                  navigate('Settings');
                }}
              />
            ),
          }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Tokens" component={TokensScreen} />
        <Stack.Screen name="Names" component={NamesScreen} />
        <Stack.Screen name="Namespaces" component={NamespacesScreen} />
        <Stack.Screen name="Assets" component={AssetsScreen} />
      </Stack.Navigator>
    </>
  );
}
