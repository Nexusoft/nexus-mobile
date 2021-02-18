import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB } from 'react-native-paper';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import Switch from 'components/Switch';
import { useTheme } from 'lib/theme';
import { login } from 'lib/user';
import { showError } from 'lib/ui';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';
import { selectSetting, updateSettings } from 'lib/settings';

const styles = {
  wrapper: {
    paddingBottom: 40,
  },
  field: {
    marginBottom: 0,
  },
  loginBtn: {
    marginTop: 20,
    marginBottom: 30,
  },
  heading: ({ theme }) => ({
    fontSize: 19,
    marginBottom: 15,
    color: theme.dark ? theme.foreground : theme.onPrimary,
  }),
  logo: {
    marginBottom: 30,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

function LoginForm({ handleSubmit, isSubmitting }) {
  return (
    <View style={styles.wrapper}>
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
      <View style={styles.rememberMe}>
        <Text sub>Remember username</Text>
        <Switch.Formik name="rememberMe" />
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const theme = useTheme();
  const savedUsername = useSelector(selectSetting('savedUsername'));
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
        initialValues={{
          username: savedUsername || '',
          password: '',
          pin: '',
          rememberMe: !!savedUsername,
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Required!'),
          password: yup.string().required('Required!'),
          pin: yup.string().required('Required!'),
          rememberMe: yup.bool(),
        })}
        onSubmit={async ({ username, password, pin, rememberMe }) => {
          try {
            await login({ username, password, pin });
            updateSettings({
              savedUsername: rememberMe ? username : null,
            });
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
  stackOptions: {
    title: 'Login',
  },
};
