import React from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { callAPI } from 'lib/api';
import { goBack } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';
import { t } from 'lib/i18n';

const styles = {
  screen: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  newCredentials: {
    marginTop: 20,
  },
  submit: {
    marginTop: 30,
  },
};

function ConfirmPasswordPinDialog({
  newPassword,
  newPin,
  visible,
  onDismiss,
  onConfirm,
}) {
  return (
    <Portal>
      <Formik
        initialValues={{
          password: '',
          pin: '',
        }}
        validationSchema={yup.object().shape({
          password: yup
            .string()
            .required(t('Required!'))
            .oneOf([newPassword], t('Mismatch!')),
          pin: yup
            .string()
            .required(t('Required!'))
            .oneOf([newPin], t('Mismatch!')),
        })}
        onSubmit={onConfirm}
      >
        {({ handleSubmit }) => (
          <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Content>
              <TextBox.Formik
                autoFocus
                secure
                name="password"
                label={t('Re-enter new password')}
              />
              <TextBox.Formik secure name="pin" label={t('Re-enter new PIN')} />
              <FAB
                mode="contained"
                style={{ marginTop: 10 }}
                onPress={handleSubmit}
                label={t('Confirm')}
              />
            </Dialog.Content>
          </Dialog>
        )}
      </Formik>
    </Portal>
  );
}

export default function ChangePasswordScreen() {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <ScreenBody style={styles.screen}>
      <Formik
        initialValues={{
          password: '',
          pin: '',
          newPassword: '',
          newPin: '',
        }}
        validationSchema={yup.object().shape({
          password: yup.string().required(t('Required!')),
          pin: yup.string().required(t('Required!')),
          newPassword: yup
            .string()
            .required(t('Required!'))
            .min(8, t('Must be at least 8 characters!')),
          newPin: yup
            .string()
            .required(t('Required!'))
            .min(4, t('Must be at least 4 characters!')),
        })}
        onSubmit={async ({ password, pin, newPassword, newPin }) => {
          try {
            await callAPI('profiles/update/credentials', {
              password,
              pin,
              new_password: newPassword,
              new_pin: newPin,
            });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          showNotification(t('Password & PIN has been updated'));
          goBack();
        }}
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <>
            <TextBox.Formik
              secure
              name="password"
              label={t('Current password')}
              autoFocus
            />
            <TextBox.Formik secure name="pin" label={t('Current PIN')} />

            <View style={styles.newCredentials}>
              <TextBox.Formik secure name="newPassword" label={t('New password')} />
              <TextBox.Formik secure name="newPin" label={t('New PIN')} />
            </View>

            <FAB
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submit}
              onPress={() => {
                setConfirming(true);
              }}
              label={
                isSubmitting
                  ? t('Updating Password & PIN...')
                  : t('Update Password & PIN')
              }
            />
            <ConfirmPasswordPinDialog
              visible={confirming}
              onDismiss={() => {
                setConfirming(false);
              }}
              newPassword={values.newPassword}
              newPin={values.newPin}
              onConfirm={() => {
                setConfirming(false);
                handleSubmit();
              }}
            />
          </>
        )}
      </Formik>
    </ScreenBody>
  );
}

ChangePasswordScreen.nav = {
  name: 'ChangePassword',
  options: {
    title: 'Password & PIN',
  },
};
