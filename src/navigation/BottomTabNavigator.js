import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { shadow, TouchableRipple, IconButton } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import OverviewScreen from 'screens/OverviewScreen';
import TransactionsScreen from 'screens/TransactionsScreen';
import AddressBookScreen from 'screens/AddressBookScreen';
import SvgIcon from 'components/SvgIcon';
import { navigate } from 'lib/navigation';
import { fade } from 'utils/color';
import { flatHeader } from 'utils/styles';
import MenuIcon from 'icons/menu.svg';
import SettingsIcon from 'icons/settings.svg';

const BottomTab = createBottomTabNavigator();
const defaultScreen = 'Overview';
const screens = [AddressBookScreen, OverviewScreen, TransactionsScreen];

export default function BottomTabNavigator() {
  const theme = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName={defaultScreen}
      backBehavior="initialRoute"
      shifting={false}
      tabBarOptions={{
        activeTintColor: theme.foreground,
        inactiveTintColor: fade(theme.foreground, 0.5),
        style: { paddingTop: 5, elevation: 4, ...shadow(4) },
        labelStyle: { marginBottom: 5 },
      }}
      screenOptions={{
        tabBarButton: (props) => {
          return <TouchableRipple {...props} />;
        },
      }}
    >
      {screens.map((Screen) => {
        const {
          nav: { name, icon, listeners, options },
        } = Screen;
        return (
          <BottomTab.Screen
            key={name}
            name={name}
            component={Screen}
            listeners={listeners}
            options={{
              title: name,
              tabBarIcon: ({ color }) => (
                <SvgIcon icon={icon} size={24} color={color} />
              ),
              tabBarLabel: name,
              ...options,
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
}

BottomTabNavigator.nav = ({ theme, navigation, txFilterOpen }) => ({
  name: 'BottomNav',
  options: ({ route }) => {
    const routeName =
      route.state?.routes[route.state.index]?.name ?? defaultScreen;
    const { stackOptions } =
      screens
        .map((Screen) =>
          typeof Screen.nav === 'function'
            ? Screen.nav({ theme, navigation, txFilterOpen })
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
      headerRight: ({ tintColor }) => (
        <IconButton
          icon={({ size }) => (
            <SvgIcon icon={SettingsIcon} size={size} color={tintColor} />
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
      ...stackOptions,
    };
  },
});
