import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB, Dialog } from 'react-native-paper';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import Portal from 'components/Portal';
import { useTheme } from 'lib/theme';
import { refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { showError } from 'lib/ui';
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
    marginBottom: 15,
    color: theme.dark ? theme.foreground : theme.onPrimary,
  }),
  logo: {
    marginBottom: 30,
  },
};

function ConfirmCredentialsDialog({
  visible,
  onDismiss,
  credentials,
  onConfirm,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Formik
          initialValues={{ password: '', pin: '' }}
          validationSchema={yup.object().shape({
            password: yup
              .string()
              .required('Required!')
              .oneOf([credentials.password], 'Mismatch!'),
            pin: yup
              .string()
              .required('Required!')
              .oneOf([credentials.pin], 'Mismatch!'),
          })}
          onSubmit={onConfirm}
        >
          {({ handleSubmit }) => (
            <Dialog.Content>
              <TextBox.Formik
                name="password"
                label="Re-enter new password"
                background={['surface', 2]}
                secure
                style={styles.field}
              />
              <TextBox.Formik
                name="pin"
                label="Re-enter new PIN"
                background={['surface', 2]}
                secure
                style={styles.field}
              />
              <FAB
                style={styles.submitBtn}
                onPress={handleSubmit}
                label="Confirm"
              />
            </Dialog.Content>
          )}
        </Formik>
      </Dialog>
    </Portal>
  );
}

function RecoveryForm({ values, handleSubmit, isSubmitting }) {
  const [confirming, setConfirming] = React.useState(false);
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
      <ConfirmCredentialsDialog
        visible={confirming}
        onDismiss={() => {
          setConfirming(false);
        }}
        credentials={values}
        onConfirm={() => {
          setConfirming(false);
          handleSubmit();
        }}
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
          <Text style={styles.heading({ theme })}>Recover user on</Text>
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
        validationSchema={yup.object().shape({
          username: yup.string().required('Required!'),
          recovery: yup.string().required('Required'),
          password: yup
            .string()
            .required('Required!')
            .min(8, 'Must be at least 8 characters!'),
          pin: yup
            .string()
            .required('Required!')
            .min(4, 'Must be at least 4 characters!'),
        })}
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
