import React from 'react';
import styled from '@emotion/native';
import { StatusBar } from 'react-native';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { shadow, IconButton } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import SvgIcon from 'components/SvgIcon';
import HomeScreen from 'screens/HomeScreen';
import SettingsScreen from 'screens/SettingsScreen';
import TokensScreen from 'screens/TokensScreen';
import NamesScreen from 'screens/NamesScreen';
import NamespacesScreen from 'screens/NamespacesScreen';
import AssetsScreen from 'screens/AssetsScreen';
import TransactionsScreen from 'screens/TransactionsScreen';
import { navigate } from 'lib/navigation';
import MenuIcon from 'icons/menu.svg';
import SettingsIcon from 'icons/settings.svg';
import LogoIcon from 'icons/logo-full.svg';

const Logo = styled(LogoIcon)(({ theme }) => ({
  color: theme.dark ? theme.primary : theme.onPrimary,
  height: 25,
  width: 110,
}));

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
        initialRouteName="Home"
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
          headerBackImage: ({ tintColor }) => (
            <IconButton icon="arrow-left" color={tintColor} size={25} />
          ),
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: ({ tintColor }) => (
              <IconButton
                icon={({ color, size }) => (
                  <SvgIcon icon={MenuIcon} {...{ color, size }} />
                )}
                color={tintColor}
                size={25}
                onPress={() => {
                  drawerNavigation.openDrawer();
                }}
              />
            ),
            headerRight: ({ tintColor }) => (
              <IconButton
                icon={({ color, size }) => (
                  <SvgIcon icon={SettingsIcon} {...{ color, size }} />
                )}
                color={tintColor}
                size={25}
                onPress={() => {
                  navigate('Settings');
                }}
              />
            ),
            title: 'Home',
            headerTitle: () => <Logo />,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: theme.dark ? theme.background : theme.primary,
              elevation: 0,
              ...shadow(0),
            },
            headerTintColor: theme.dark ? theme.foreground : theme.onPrimary,
          }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Tokens" component={TokensScreen} />
        <Stack.Screen name="Names" component={NamesScreen} />
        <Stack.Screen name="Namespaces" component={NamespacesScreen} />
        <Stack.Screen name="Assets" component={AssetsScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
      </Stack.Navigator>
    </>
  );
}
