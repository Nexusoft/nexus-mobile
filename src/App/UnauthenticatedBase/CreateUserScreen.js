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
import { callAPI } from 'lib/api';
import { showError } from 'lib/ui';
import { login, setregistrationTxids } from 'lib/user';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';

const styles = {
  field: {
    marginBottom: 0,
  },
  submitBtn: {
    marginTop: 20,
    marginBottom: 40,
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

function ConfirmUserDialog({ visible, onDismiss, newUser, onConfirm }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Formik
          initialValues={{ password: '', pin: '' }}
          validationSchema={yup.object().shape({
            password: yup
              .string()
              .required('Required!')
              .oneOf([newUser.password], 'Mismatch!'),
            pin: yup
              .string()
              .required('Required!')
              .oneOf([newUser.pin], 'Mismatch!'),
          })}
          onSubmit={onConfirm}
        >
          {({ handleSubmit }) => (
            <Dialog.Content>
              <TextBox.Formik
                name="password"
                label="Re-enter password"
                background={['surface', 2]}
                secure
                style={styles.field}
              />
              <TextBox.Formik
                name="pin"
                label="Re-enter PIN"
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

function CreateUserForm({ values, handleSubmit, isSubmitting }) {
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
        style={styles.submitBtn}
        disabled={isSubmitting}
        loading={isSubmitting}
        onPress={() => {
          setConfirming(true);
        }}
        label={isSubmitting ? 'Creating user' : 'Create user'}
      />
      <ConfirmUserDialog
        visible={confirming}
        onDismiss={() => {
          setConfirming(false);
        }}
        newUser={values}
        onConfirm={() => {
          setConfirming(false);
          handleSubmit();
        }}
      />
    </View>
  );
}

export default function CreateUserScreen() {
  const theme = useTheme();

  return (
    <Backdrop
      backdropContent={
        <>
          <Text style={styles.heading({ theme })}>Create user on</Text>
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
        validationSchema={yup.object().shape({
          username: yup
            .string()
            .required('Required!')
            .min(3, 'Must be at least 3 characters!'),
          password: yup
            .string()
            .required('Required!')
            .min(8, 'Must be at least 8 characters!'),
          pin: yup
            .string()
            .required('Required!')
            .min(4, 'Must be at least 4 characters!'),
        })}
        onSubmit={async ({ username, password, pin }) => {
          try {
            const result = await callAPI('users/create/user', {
              username,
              password,
              pin,
            });
            setregistrationTxids({ username, txid: result.hash });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          // Allow mempool login
          try {
            await login({ username, password, pin });
          } catch (err) {
            console.log(err);
            showError(
              err &&
                err.message +
                  '\n Your account was created but encountered an login error'
            );
            return;
          }
        }}
        component={CreateUserForm}
      />
    </Backdrop>
  );
}

CreateUserScreen.nav = {
  name: 'CreateUser',
  title: 'Register',
  stackOptions: {
    title: 'Register',
  },
};
