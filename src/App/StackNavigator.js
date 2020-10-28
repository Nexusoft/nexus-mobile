import React from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import {
  createStackNavigator,
  Header,
  HeaderBackground,
} from '@react-navigation/stack';
import { shadow } from 'react-native-paper';

import ReceiveScreen from './screens/ReceiveScreen';
import SendScreen from './screens/SendScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountsScreen from './screens/AccountsScreen';
import TokensScreen from './screens/TokensScreen';
import NamesScreen from './screens/NamesScreen';
import NamespacesScreen from './screens/NamespacesScreen';
import AssetsScreen from './screens/AssetsScreen';
import TransactionDetailsScreen from './screens/TransactionDetailsScreen';
import AccountDetailsScreen from './screens/AccountDetailsScreen';
import ContactDetailsScreen from './screens/ContactDetailsScreen';
import NewAccountScreen from './screens/NewAccountScreen';
import NewContactScreen from './screens/NewContactScreen';
import ConfirmSendScreen from './screens/ConfirmSendScreen';
import EmeddedCoreLogReaderScreen from './screens/EmeddedCoreLogReaderScreen';
import ExternalCoreConfigScreen from './screens/ExternalCoreConfigScreen';
import SetRecoveryScreen from './screens/SetRecoveryScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import CoreInfoScreen from './screens/CoreInfoScreen';
import AboutScreen from './screens/AboutScreen';
import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import { getStore } from 'store';
import BaseScreen from './BaseScreen';

const Stack = createStackNavigator();

const screens = [
  BaseScreen,
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
  EmeddedCoreLogReaderScreen,
  ExternalCoreConfigScreen,
  SetRecoveryScreen,
  ChangePasswordScreen,
  CoreInfoScreen,
  AboutScreen,
];

export default function StackNavigator({ navigation }) {
  const theme = useTheme();
  React.useEffect(() => {
    const store = getStore();
    store.observe(selectLoggedIn, (loggedIn) => {
      if (!loggedIn) {
        navigation.closeDrawer();
      }
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Stack.Navigator
        initialRouteName="Base"
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
              ? Screen.nav({ theme })
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
