import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import { refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { showError } from 'lib/user';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';

const styles = {
  field: {
    marginBottom: 0,
  },
  loginBtn: {
    marginTop: 20,
  },
  heading: ({ theme }) => ({
    fontSize: 19,
    marginBottom: 12,
    color: theme.dark ? theme.foreground : theme.onPrimary,
  }),
  logo: {
    marginBottom: 30,
  },
};

function LoginForm({ handleSubmit, isSubmitting }) {
  return (
    <View>
      <TextBox.Formik
        name="username"
        label="Username"
        background={['surface', 2]}
        style={styles.field}
      />
      <TextBox.Formik
        name="password"
        label="Password"
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <TextBox.Formik
        name="pin"
        label="PIN"
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <FAB
        style={styles.loginBtn}
        disabled={isSubmitting}
        loading={isSubmitting}
        onPress={handleSubmit}
        label={isSubmitting ? 'Logging in' : 'Log in'}
      />
    </View>
  );
}

export default function LoginScreen() {
  const theme = useTheme();
  return (
    <Backdrop
      backdropContent={
        <>
          <Text style={styles.heading({ theme })}>Log in to</Text>
          <SvgIcon
            icon={LogoIcon}
            width={180}
            height={41}
            color={theme.dark ? theme.foreground : theme.onPrimary}
            style={styles.logo}
          />
        </>
      }
    >
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
    </Backdrop>
  );
}

LoginScreen.nav = {
  name: 'Login',
  title: 'Login',
};
