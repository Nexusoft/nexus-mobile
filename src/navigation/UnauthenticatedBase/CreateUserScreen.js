import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB, Dialog, ActivityIndicator } from 'react-native-paper';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import Portal from 'components/Portal';
import { useTheme } from 'lib/theme';
import { sendAPI } from 'lib/api';
import { showError, showSuccess } from 'lib/ui';
import { getStore } from 'store';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';

const styles = {
  field: {
    marginBottom: 0,
  },
  submitBtn: {
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
  creatingText: {
    marginTop: 50,
  },
};

function ConfirmUserDialog({ visible, onDismiss, newUser, onConfirm }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Formik
          initialValues={{ password: '', pin: '' }}
          validationSchema={yup.object().shape({
            password: yup.string().oneOf([newUser.password], 'Mismatch!'),
            pin: yup.string().oneOf([newUser.pin], 'Mismatch!'),
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
  const [creatingUsername, setCreatingUsername] = React.useState(false);
  const watchUserRegistration = (username) => {
    setCreatingUsername(username);
    const store = getStore();
    const unobserve = store.observe(
      (state) => state.core?.info?.blocks,
      async (blocks) => {
        if (blocks) {
          const txs = await apiPost('users/list/transactions', {
            username,
            order: 'asc',
            limit: 1,
            verbose: 'summary',
          });
          if (txs && txs[0]?.confirmations) {
            unobserve();
            showSuccess(
              <Text>
                User registration for <Text bold>{username}</Text> has been
                confirmed!
              </Text>
            );
            setCreatingUsername(null);
          }
        }
      }
    );
  };

  return (
    <Backdrop
      backdropContent={
        <>
          <Text style={styles.heading({ theme })}>Register on</Text>
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
      {!!creatingUsername ? (
        <Text style={styles.creatingText}>
          <ActivityIndicator animating color={theme.foreground} /> User
          registration for <Text bold>{creatingUsername}</Text> is waiting to be
          confirmed on Nexus blockchain...
        </Text>
      ) : (
        <Formik
          initialValues={{ username: '', password: '', pin: '' }}
          onSubmit={async ({ username, password, pin }) => {
            try {
              await sendAPI('users/create/user', { username, password, pin });
            } catch (err) {
              showError(err && err.message);
              return;
            }
            watchUserRegistration(username);
          }}
          component={CreateUserForm}
        />
      )}
    </Backdrop>
  );
}

CreateUserScreen.nav = {
  name: 'CreateUser',
  title: 'Register',
};
