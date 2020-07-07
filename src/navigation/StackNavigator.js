import React from 'react';
import { StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import {
  createStackNavigator,
  Header,
  HeaderBackground,
} from '@react-navigation/stack';
import { shadow } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTheme } from 'lib/theme';

import ReceiveScreen from 'screens/ReceiveScreen';
import SendScreen from 'screens/SendScreen';
import SettingsScreen from 'screens/SettingsScreen';
import AccountsScreen from 'screens/AccountsScreen';
import TokensScreen from 'screens/TokensScreen';
import NamesScreen from 'screens/NamesScreen';
import NamespacesScreen from 'screens/NamespacesScreen';
import AssetsScreen from 'screens/AssetsScreen';
import TransactionDetailsScreen from 'screens/TransactionDetailsScreen';
import AccountDetailsScreen from 'screens/AccountDetailsScreen';
import ContactDetailsScreen from 'screens/ContactDetailsScreen';
import NewAccountScreen from 'screens/NewAccountScreen';
import NewContactScreen from 'screens/NewContactScreen';
import ConfirmSendScreen from 'screens/ConfirmSendScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const screens = [
  BottomTabNavigator,
  ReceiveScreen,
  SendScreen,
  SettingsScreen,
  AccountsScreen,
  TokensScreen,
  NamesScreen,
  NamespacesScreen,
  AssetsScreen,
  TransactionDetailsScreen,
  AccountDetailsScreen,
  ContactDetailsScreen,
  NewAccountScreen,
  NewContactScreen,
  ConfirmSendScreen,
];

export default function StackNavigator({ navigation }) {
  const theme = useTheme();
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
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
          header: (props) => <Header {...props} />,
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
        }}
      >
        {screens.map((Screen) => {
          const { name, options } =
            typeof Screen.nav === 'function'
              ? Screen.nav({ theme, navigation, txFilterOpen, contactSearch })
              : Screen.nav;

          return (
            <Stack.Screen
              key={name}
              name={name}
              component={Screen}
              options={options}
            />
          );
        })}
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
}
