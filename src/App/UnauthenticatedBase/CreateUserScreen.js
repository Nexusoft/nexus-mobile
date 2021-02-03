import React from 'react';
import { View, Clipboard } from 'react-native';
import { Formik } from 'formik';
import { FAB, Dialog, ActivityIndicator, Button } from 'react-native-paper';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import Portal from 'components/Portal';
import { useTheme } from 'lib/theme';
import { callAPI } from 'lib/api';
import { showError, showSuccess, showNotification } from 'lib/ui';
import { navigate } from 'lib/navigation';
import { refreshUserStatus, selectLoggedIn } from 'lib/user';
import { getStore } from 'store';
import useMounted from 'utils/useMounted';
import LogoIcon from 'icons/logo-full.svg';
import CopyIcon from 'icons/copy.svg';
import Backdrop from './Backdrop';
import { loadTransactions } from 'lib/transactions';

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
  creating: {
    marginTop: 50,
    verticalAlign: 'center',
  },
  creatingText: {
    marginTop: 40,
    textAlign: 'center',
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

function useRegistrationWatcher() {
  const [registration, setRegistration] = React.useState(null);
  const mounted = useMounted();
  const watchRegistration = React.useCallback(
    ({ username, txid }) => {
      setRegistration({ username, txid });
      const store = getStore();
      const unobserve = store.observe(
        (state) => state.core?.info?.blocks,
        async (blocks) => {
          if (blocks) {
            const txs = await callAPI('users/list/transactions', {
              username: registration?.username,
              order: 'asc',
              limit: 1,
              verbose: 'summary',
            });
            if (txs && txs[0]?.confirmations) {
              unobserve();
              const store = getStore();
              const loggedIn = selectLoggedIn(store.getState());
              showSuccess(
                <Text>
                  User <Text bold>{registration?.username}</Text> has been
                  registered on Nexus blockchain!
                </Text>,
                {
                  getButtons: ({ onDismiss }) => (
                    <>
                      <Button mode="text" onPress={onDismiss}>
                        Dismiss
                      </Button>
                      {!loggedIn && (
                        <Button
                          mode="text"
                          onPress={() => {
                            onDismiss();
                            navigate('Login');
                          }}
                        >
                          Log in
                        </Button>
                      )}
                    </>
                  ),
                }
              );
              if (mounted.current) {
                setRegistration(null);
              }
            }
          }
        }
      );
    },
    [registration]
  );
  return [registration, watchRegistration];
}

export default function CreateUserScreen() {
  const theme = useTheme();
  //const [registration, watchRegistration] = useRegistrationWatcher();

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
                await callAPI('users/create/user', {
                username,
                password,
                pin,
              });
            } catch (err) {
              showError(err && err.message);
              return;
            }
            // Allow mempool login
            try {
              await callAPI('users/login/user', { username, password, pin });
              await callAPI('users/unlock/user', { pin, notifications: true });
              await refreshUserStatus();
              await loadTransactions();
            } catch (err) {
              console.log(err);
              showError(err && (err.message + '\n Your account was created but encountered an login error'));
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
