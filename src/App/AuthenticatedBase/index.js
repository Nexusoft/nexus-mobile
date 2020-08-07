import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import {
  shadow,
  TouchableRipple,
  IconButton,
  overlay,
} from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useTheme } from 'lib/theme';
import OverviewScreen from './OverviewScreen';
import TransactionsScreen from './TransactionsScreen';
import ContactsScreen from './ContactsScreen';
import SvgIcon from 'components/SvgIcon';
import { fade } from 'utils/color';
import { flatHeader } from 'utils/styles';
import MenuIcon from 'icons/menu.svg';

const BottomTab = createBottomTabNavigator();
const defaultScreen = 'Overview';
const screens = [ContactsScreen, OverviewScreen, TransactionsScreen];

export default function AuthenticatedBase() {
  const theme = useTheme();
  const navigation = useNavigation();
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);

  return (
    <BottomTab.Navigator
      initialRouteName={defaultScreen}
      backBehavior="initialRoute"
      shifting={false}
      tabBarOptions={{
        activeTintColor: theme.foreground,
        inactiveTintColor: fade(theme.foreground, 0.5),
        style: {
          paddingTop: 5,
          elevation: 4,
          ...shadow(4),
          backgroundColor: overlay(2, theme.surface),
        },
        labelStyle: { marginBottom: 5 },
        keyboardHidesTabBar: true,
      }}
      screenOptions={{
        tabBarButton: (props) => {
          return <TouchableRipple {...props} />;
        },
      }}
    >
      {screens.map((Screen) => {
        const { name, title, icon, listeners, options } =
          typeof Screen.nav === 'function'
            ? Screen.nav({ theme, navigation, txFilterOpen, contactSearch })
            : Screen.nav;
        return (
          <BottomTab.Screen
            key={name}
            name={name}
            component={Screen}
            listeners={listeners}
            options={{
              title: title || name,
              tabBarIcon: ({ color }) => (
                <SvgIcon icon={icon} size={20} color={color} />
              ),
              tabBarLabel: title || name,
              ...options,
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
}

AuthenticatedBase.stackOptions = ({
  theme,
  navigation,
  txFilterOpen,
  contactSearch,
  route,
}) => {
  const routeName =
    route.state?.routes[route.state.index]?.name || defaultScreen;
  const { stackOptions } =
    screens
      .map((Screen) =>
        typeof Screen.nav === 'function'
          ? Screen.nav({ theme, navigation, txFilterOpen, contactSearch })
          : Screen.nav
      )
      .find((nav) => nav.name === routeName) || {};

  return {
    headerLeft: ({ tintColor }) => (
      <IconButton
        icon={({ size }) => (
          <SvgIcon icon={MenuIcon} size={size} color={tintColor} />
        )}
        color={tintColor}
        size={25}
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    headerStyle:
      routeName === 'Overview' || (routeName === 'Transactions' && txFilterOpen)
        ? flatHeader(theme)
        : undefined,
    ...stackOptions,
  };
};
