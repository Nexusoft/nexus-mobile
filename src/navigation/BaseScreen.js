import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { FAB, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import BottomTabNavigator from 'navigation/BottomTabNavigator';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import { refreshCoreInfo, selectConnected } from 'lib/coreInfo';
import { useTheme } from 'lib/theme';
import { navigate } from 'lib/navigation';
import { selectLoggedIn, refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { showError } from 'lib/user';
import { flatHeader } from 'utils/styles';
import SettingsIcon from 'icons/settings.svg';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.dark ? theme.surface : theme.primary,
    alignItems: 'stretch',
    justifyContent: 'center',
  }),
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
        { color: theme.dark ? theme.foreground : theme.onPrimary },
        style,
      ]}
      {...rest}
    />
  );
}

function LoginForm({ handleSubmit, isSubmitting }) {
  return (
    <View style={{ paddingHorizontal: 30 }}>
      <TextBox.Formik
        mode="outlined"
        name="username"
        label="Username"
        background="surface"
        style={styles.field}
      />
      <TextBox.Formik
        mode="outlined"
        name="password"
        label="Password"
        background="surface"
        secure
        style={styles.field}
      />
      <TextBox.Formik
        mode="outlined"
        name="pin"
        label="PIN"
        background="surface"
        secure
        style={styles.field}
      />
      <FAB
        style={styles.loginBtn}
        disabled={isSubmitting}
        onPress={handleSubmit}
        label="Log in"
      />
    </View>
  );
}

export default function BaseScreen({ route }) {
  const theme = useTheme();
  const loggedIn = useSelector(selectLoggedIn);
  const connected = useSelector(selectConnected);
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (loggedIn) {
      navigation.setOptions(
        BottomTabNavigator.nav({
          theme,
          navigation,
          txFilterOpen,
          contactSearch,
        }).options({ route })
      );
    } else {
      navigation.setOptions({
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
    }
  }, [route, theme, loggedIn, txFilterOpen, contactSearch, navigation]);

  return loggedIn ? (
    <BottomTabNavigator />
  ) : (
    <View style={styles.wrapper({ theme })}>
      {connected ? (
        <Formik
          initialValues={{ username: '', password: '', pin: '' }}
          onSubmit={async ({ username, password, pin }) => {
            try {
              await sendAPI('users/login/user', { username, password, pin });
              await refreshUserStatus();
            } catch (err) {
              showError(err && err.message);
            }
          }}
          component={LoginForm}
        />
      ) : (
        <ColoredText>Connecting to the Core...</ColoredText>
      )}
    </View>
  );
}

BaseScreen.nav = {
  name: 'Base',
};
