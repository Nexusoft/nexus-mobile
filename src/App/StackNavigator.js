import React from 'react';
import { useSelector } from 'react-redux';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { HeaderBackground } from '@react-navigation/elements';
import { shadow } from 'react-native-paper';

import ReceiveScreen from './screens/ReceiveScreen';
import SendScreen from './screens/SendScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountsScreen from './screens/AccountsScreen';
import ContactsScreen from './screens/ContactsScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import RenameAccountScreen from './screens/RenameAccountScreen';
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
import SummaryScreen from './screens/SummaryScreen';
import StakingScreen from './screens/StakingScreen';
import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import { resetToBase } from 'lib/navigation';
import { getStore } from 'store';
import BaseScreen from './BaseScreen';

const Stack = createStackNavigator();

const screens = [
  BaseScreen,
  ReceiveScreen,
  SendScreen,
  SettingsScreen,
  AccountsScreen,
  ContactsScreen,
  TransactionsScreen,
  RenameAccountScreen,
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
  SummaryScreen,
  StakingScreen,
];

export default function StackNavigator({ navigation }) {
  const theme = useTheme();
  const txFilterOpen = useSelector((state) => state.ui.transactionsFilter.open);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
  React.useEffect(() => {
    const store = getStore();
    return store.observe(selectLoggedIn, (loggedIn, wasLoggedIn) => {
      if (!loggedIn) {
        navigation.closeDrawer();
      }
      //back to Base so no screen keeps the old user's data
      if (!loggedIn && wasLoggedIn) {
        resetToBase();
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
        screenOptions={{
          headerMode: 'screen',
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
          const { name, options, listeners } =
            typeof Screen.nav === 'function'
              ? Screen.nav({ theme, txFilterOpen, contactSearch })
              : Screen.nav;

          return (
            <Stack.Screen
              key={name}
              name={name}
              component={Screen}
              options={options}
              listeners={listeners}
            />
          );
        })}
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
}
