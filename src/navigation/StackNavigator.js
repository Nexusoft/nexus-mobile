import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, Header } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

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
        headerMode="screen"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.dark ? theme.surface : theme.primary,
            elevation: 4,
            ...shadow(3),
          },
          headerTintColor: theme.dark ? theme.foreground : theme.onPrimary,
          // Fix header background color not changing when theme is changed
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen
          name="BottomNav"
          component={BottomTabNavigator}
          options={({ route }) => {
            const routeName =
              route.state?.routes[route.state.index]?.name ?? defaultScreen;
            const screen = screens.find((screen) => screen.name === routeName);
            const customOptions =
              typeof screen.stackOptions === 'function'
                ? screen.stackOptions({ theme })
                : screen.stackOptions;

            return {
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
              ...customOptions,
            };
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
