import React from 'react';
import { View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, shadow, overlay } from 'react-native-paper';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import CustomBottomTabBar from 'components/CustomBottomTabBar';
import { useTheme, subColor } from 'lib/theme';
import { navigate } from 'lib/navigation';
import { flatHeader } from 'utils/styles';
import { fade } from 'utils/color';
import SettingsIcon from 'icons/settings.svg';
import CreateUserScreen from './CreateUserScreen';
import LoginScreen from './LoginScreen';
import RecoveryScreen from './RecoveryScreen';
import infoIcon from 'icons/info-circle-inverse.svg';
import { version, builddate } from '../../../package.json'; // not too happy about this

const BottomTab = createBottomTabNavigator();
const screens = [CreateUserScreen, LoginScreen, RecoveryScreen];
const defaultScreen = 'Login';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  connectingMsg: {
    textAlign: 'center',
    fontSize: 18,
  },
  field: {
    marginBottom: 10,
  },
  loginBtn: {
    marginTop: 10,
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    opacity: 0.75,
  },
};

export default function UnauthenticatedBase() {
  const theme = useTheme();
  return (
    <View style={styles.wrapper({ theme })}>
      <BottomTab.Navigator
        initialRouteName={defaultScreen}
        shifting={false}
        tabBar={(props) => <CustomBottomTabBar {...props} />}
        tabBarOptions={{
          activeTintColor: theme.foreground,
          inactiveTintColor: fade(theme.foreground, 0.5),
          style: {
            paddingTop: 5,
            elevation: 4,
            ...shadow(4),
            backgroundColor: overlay(2, theme.surface),
          },
          labelStyle: { marginBottom: 5, textTransform: 'uppercase' },
          labelPosition: 'beside-icon',
        }}
      >
        {screens.map((Screen) => {
          const { name, title, listeners, options } =
            typeof Screen.nav === 'function'
              ? Screen.nav({ theme })
              : Screen.nav;
          return (
            <BottomTab.Screen
              key={name}
              name={name}
              component={Screen}
              listeners={listeners}
              options={{
                title: title || name,
                tabBarLabel: title || name,
                ...options,
              }}
            />
          );
        })}
      </BottomTab.Navigator>
    </View>
  );
}

UnauthenticatedBase.stackOptions = ({ theme, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) || defaultScreen;
  const { stackOptions } =
    screens.map((Screen) => Screen.nav).find((nav) => nav.name === routeName) ||
    {};
  return {
    headerLeft: ({ tintColor }) => (
      <View style={styles.infoView}>
        <IconButton
          icon={({ size }) => (
            <SvgIcon icon={infoIcon} size={size} color={tintColor} />
          )}
          color={tintColor}
          size={20}
          onPress={() => {
            navigate('CoreInfo');
          }}
        />

        <Text
          colorName={theme.dark ? 'foreground' : 'onPrimary'}
          style={styles.versionText}
        >
          v {version}
        </Text>
      </View>
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
    headerStyle: flatHeader(theme),
    headerTitle: '',
    ...stackOptions,
  };
};
