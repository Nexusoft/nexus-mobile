import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import Switch from 'components/Switch';
import { useTheme } from 'lib/theme';
import { logIn } from 'lib/user';
import * as TYPE from 'consts/actionTypes';
import { openUnlockScreen, showError } from 'lib/ui';
import { getStore } from 'store';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';
import { selectSetting } from 'lib/settings';

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
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
};

function LoginForm({ handleSubmit, isSubmitting, values }) {
  const theme = useTheme();
  const hasSavedSession = useSelector((state) => state.user.hasSavedSession);
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

      <View style={styles.options}>
        <Text sub>Remember username</Text>
        <Switch.Formik name="rememberMe" />
      </View>
      <View style={styles.options}>
        <Text sub={!!values.rememberMe} disabled={!values.rememberMe}>
          Keep me logged in
        </Text>
        <Switch.Formik name="keepLoggedIn" disabled={!values.rememberMe} />
      </View>

      {hasSavedSession && (
        <Button
          mode="text"
          color={theme.dark ? theme.foreground : theme.primary}
          labelStyle={{ fontSize: 12 }}
          style={{ marginTop: 10 }}
          onPress={() => {
            getStore().dispatch({
              type: TYPE.SET_IGNORE_SAVED_SESSION,
              payload: false,
            });
          }}
        >
          Return to saved session
        </Button>
      )}
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
          keepLoggedIn: false,
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Required!'),
          password: yup.string().min(8).required('Required!'),
          pin: yup.string().min(4).required('Required!'),
          rememberMe: yup.bool(),
          keepLoggedIn: yup.bool(),
        })}
        onSubmit={async ({
          username,
          password,
          pin,
          rememberMe,
          keepLoggedIn,
        }) => {
          try {
            await logIn({ username, password, pin, rememberMe, keepLoggedIn });
          } catch (err) {
            const syncing = getStore()?.getState().core.info?.syncing;
            const message =
              err?.message +
              (syncing &&
              // Error code -130: Account doesn't exist or connection failed.
              (err?.code === -130 ||
                // Error code -139: Invalid credentials
                err?.code === -139)
                ? '\n\nNot being fully synchronized may have caused this error. Please wait for synchronization to complete and try again.'
                : '');
            showError(message);
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
