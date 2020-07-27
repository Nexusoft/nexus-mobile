import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FAB, IconButton, shadow, overlay } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AuthenticatedBase from 'navigation/AuthenticatedBase';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import { refreshCoreInfo, selectConnected } from 'lib/coreInfo';
import { useTheme, subColor } from 'lib/theme';
import { navigate } from 'lib/navigation';
import { selectLoggedIn, refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { showError } from 'lib/ui';
import { flatHeader } from 'utils/styles';
import { fade } from 'utils/color';
import SettingsIcon from 'icons/settings.svg';
import CreateUserScreen from './CreateUserScreen';
import LoginScreen from './LoginScreen';
import RecoveryScreen from './RecoveryScreen';

const BottomTab = createBottomTabNavigator();
const screens = [CreateUserScreen, LoginScreen, RecoveryScreen];

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
};

function ColoredText({ style, ...rest }) {
  const theme = useTheme();
  return (
    <Text
      style={[
        { color: subColor(theme.dark ? theme.foreground : theme.onPrimary) },
        style,
      ]}
      {...rest}
    />
  );
}

export default function UnauthenticatedBase() {
  const theme = useTheme();
  const connected = useSelector(selectConnected);

  return (
    <View style={styles.wrapper({ theme })}>
      {connected ? (
        <BottomTab.Navigator
          initialRouteName="Login"
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
      ) : (
        <ColoredText style={styles.connectingMsg}>
          Connecting to the Core...
        </ColoredText>
      )}
    </View>
  );
  //
  //     <Formik
  //       initialValues={{ username: '', password: '', pin: '' }}
  //       onSubmit={async ({ username, password, pin }) => {
  //         try {
  //           await sendAPI('users/login/user', { username, password, pin });
  //           await refreshUserStatus();
  //         } catch (err) {
  //           showError(err && err.message);
  //         }
  //       }}
  //       component={LoginForm}
  //     />
  //
  // </View>
}

UnauthenticatedBase.stackOptions = ({ theme }) => ({
  headerLeft: () => null,
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
});
