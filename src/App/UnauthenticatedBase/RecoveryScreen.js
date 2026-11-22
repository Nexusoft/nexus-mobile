import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { FAB } from 'react-native-paper';
import * as yup from 'yup';

import Dialog from 'components/Dialog';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import Portal from 'components/Portal';
import { useTheme } from 'lib/theme';
import { refreshUserStatus } from 'lib/session';
import { callAPI } from 'lib/api';
import { showError, showSuccess } from 'lib/ui';
import { t } from 'lib/i18n';
import LogoIcon from 'icons/logo-full.svg';
import Backdrop from './Backdrop';

const styles = {
  field: {
    marginBottom: 0,
  },
  recoverBtn: {
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
              .required(t('Required!'))
              .oneOf([credentials.password], t('Mismatch!')),
            pin: yup
              .string()
              .required(t('Required!'))
              .oneOf([credentials.pin], t('Mismatch!')),
          })}
          onSubmit={onConfirm}
        >
          {({ handleSubmit }) => (
            <Dialog.Content>
              <TextBox.Formik
                name="password"
                label={t('Re-enter new password')}
                background={['surface', 2]}
                secure
                style={styles.field}
              />
              <TextBox.Formik
                name="pin"
                label={t('Re-enter new PIN')}
                background={['surface', 2]}
                secure
                style={styles.field}
              />
              <FAB
                style={styles.submitBtn}
                onPress={handleSubmit}
                label={t('Confirm')}
              />
            </Dialog.Content>
          )}
        </Formik>
      </Dialog>
    </Portal>
  );
}

function RecoveryForm({
  values,
  handleSubmit,
  isSubmitting,
  validateForm,
  setTouched,
}) {
  const [confirming, setConfirming] = React.useState(false);
  return (
    <View>
      <TextBox.Formik
        name="username"
        label={t('Username')}
        background={['surface', 2]}
        style={styles.field}
      />
      <TextBox.Formik
        name="recovery"
        label={t('Recovery phrase')}
        background={['surface', 2]}
        multiline
        style={styles.field}
      />
      <TextBox.Formik
        name="password"
        label={t('New password')}
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <TextBox.Formik
        name="pin"
        label={t('New PIN')}
        background={['surface', 2]}
        secure
        style={styles.field}
      />
      <FAB
        style={styles.recoverBtn}
        disabled={isSubmitting}
        loading={isSubmitting}
        onPress={async () => {
          const errors = await validateForm();
          if (Object.keys(errors).length) {
            setTouched({
              username: true,
              recovery: true,
              password: true,
              pin: true,
            });
            return;
          }
          setConfirming(true);
        }}
        label={isSubmitting ? t('Recovering') : t('Recover')}
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
          <Text style={styles.heading({ theme })}>{t('Recover user on')}</Text>
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
          username: yup.string().required(t('Required!')),
          recovery: yup.string().required(t('Required')),
          password: yup
            .string()
            .required(t('Required!'))
            .min(8, t('Must be at least 8 characters!')),
          pin: yup
            .string()
            .required(t('Required!'))
            .min(4, t('Must be at least 4 characters!')),
        })}
        onSubmit={async (
          { username, recovery, password, pin },
          { resetForm }
        ) => {
          try {
            await callAPI('profiles/recover/master', {
              username,
              recovery: recovery.trim().replace(/\s+/g, ' '),
              password,
              pin,
            });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          resetForm();
          showSuccess(
            t(
              'Your password and PIN have been reset. You can now log in with the new password and PIN.'
            )
          );
          await refreshUserStatus();
        }}
        component={RecoveryForm}
      />
    </Backdrop>
  );
}

RecoveryScreen.nav = {
  name: 'Recovery',
  title: 'Recover',
  stackOptions: {
    title: 'Recover',
  },
};
