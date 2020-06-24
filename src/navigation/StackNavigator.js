import React from 'react';
import { StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import {
  createStackNavigator,
  Header,
  HeaderBackground,
} from '@react-navigation/stack';
import { shadow, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTheme } from 'emotion-theming';

import { backgroundProvider } from 'lib/adaptive';
import SvgIcon from 'components/SvgIcon';
import ReceiveScreen from 'screens/ReceiveScreen';
import SettingsScreen from 'screens/SettingsScreen';
import AccountsScreen from 'screens/AccountsScreen';
import TokensScreen from 'screens/TokensScreen';
import NamesScreen from 'screens/NamesScreen';
import NamespacesScreen from 'screens/NamespacesScreen';
import AssetsScreen from 'screens/AssetsScreen';
import TransactionDetailsScreen from 'screens/TransactionDetailsScreen';
import AccountDetailsScreen from 'screens/AccountDetailsScreen';
import NewAccountScreen from 'screens/NewAccountScreen';
import { navigate } from 'lib/navigation';
import MenuIcon from 'icons/menu.svg';
import SettingsIcon from 'icons/settings.svg';
import BottomTabNavigator from './BottomTabNavigator';
import { screens, defaultScreen } from './bottomTabScreens';

const flatHeader = (theme) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
  elevation: 0,
  ...shadow(0),
});

const BottomNavHeader = backgroundProvider()(Header);

const Stack = createStackNavigator();

export default function StackNavigator({ navigation: drawerNavigation }) {
  const theme = useTheme();
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
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
          // and populate ColorContext to children
          header: (props) => (
            <BottomNavHeader
              {...props}
              style={{
                backgroundColor: theme.dark ? theme.surface : theme.primary,
              }}
            />
          ),
          // Fix the white line at the header bottom
          headerBackground: theme.dark
            ? undefined
            : () => (
                <HeaderBackground
                  style={{
                    backgroundColor: theme.primary,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                    elevation: 0,
                  }}
                />
              ),
          // headerBackImage: ({ tintColor }) => (
          //   <IconButton
          //     icon="arrow-left"
          //     color={tintColor}
          //     rippleColor={tintColor}
          //     size={25}
          //   />
          // ),
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
                <IconButton
                  icon={({ size }) => (
                    <SvgIcon icon={MenuIcon} size={size} color={tintColor} />
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
                  icon={({ size }) => (
                    <SvgIcon
                      icon={SettingsIcon}
                      size={size}
                      color={tintColor}
                    />
                  )}
                  color={tintColor}
                  size={25}
                  onPress={() => {
                    navigate('Settings');
                  }}
                />
              ),
              headerStyle:
                routeName === 'Overview' ||
                (routeName === 'Transactions' && txFilterOpen)
                  ? flatHeader(theme)
                  : undefined,
              ...customOptions,
            };
          }}
        />
        <Stack.Screen
          name="Receive"
          component={ReceiveScreen}
          options={({ route }) => ({
            headerTitleAlign: 'center',
            headerTitle: route.params?.account?.name,
            headerStyle: flatHeader(theme),
            // headerTintColor: theme.foreground,
            // headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Accounts" component={AccountsScreen} />
        <Stack.Screen name="Tokens" component={TokensScreen} />
        <Stack.Screen name="Names" component={NamesScreen} />
        <Stack.Screen name="Namespaces" component={NamespacesScreen} />
        <Stack.Screen name="Assets" component={AssetsScreen} />
        <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
          options={{
            title: Platform.OS === 'ios' ? 'Details' : 'Transaction Details',
          }}
        />
        <Stack.Screen
          name="AccountDetails"
          component={AccountDetailsScreen}
          options={{
            title: Platform.OS === 'ios' ? 'Details' : 'Account Details',
          }}
        />
        <Stack.Screen
          name="NewAccount"
          component={NewAccountScreen}
          options={{
            title: 'New account',
          }}
        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
}
