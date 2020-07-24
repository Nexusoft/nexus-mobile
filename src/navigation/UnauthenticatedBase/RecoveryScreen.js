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

function RecoveryForm({ handleSubmit, isSubmitting }) {
  return (
    <View>
      <TextBox.Formik
        name="username"
        label="Username"
        background={['surface', 2]}
        style={styles.field}
      />
      <TextBox.Formik
        name="recovery"
        label="Recovery phrase"
        background={['surface', 2]}
        multiline
        style={styles.field}
      />
      <TextBox.Formik
        name="password"
        label="New password"
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <TextBox.Formik
        name="pin"
        label="New PIN"
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <FAB
        style={styles.loginBtn}
        disabled={isSubmitting}
        loading={isSubmitting}
        onPress={handleSubmit}
        label={isSubmitting ? 'Recovering' : 'Recover'}
      />
    </View>
  );
}

export default function RecoveryScreen() {
  const theme = useTheme();
  return (
    <Backdrop
      backdropContent={
        <>
          <Text style={styles.heading({ theme })}>Recover user</Text>
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
          username: '',
          recovery: '',
          password: '',
          pin: '',
        }}
        onSubmit={async ({ username, recovery, password, pin }) => {
          try {
            await sendAPI('users/recover/user', {
              username,
              recovery,
              password,
              pin,
            });
            await refreshUserStatus();
          } catch (err) {
            showError(err && err.message);
          }
        }}
        component={RecoveryForm}
      />
    </Backdrop>
  );
}

RecoveryScreen.nav = {
  name: 'Recovery',
  title: 'Recover',
};
