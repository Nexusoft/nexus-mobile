import React from 'react';
import { View } from 'react-native';
import { FAB, Dialog } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import Portal from 'components/Portal';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { sendAPI } from 'lib/api';
import { goBack } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';

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
          password: yup.string().oneOf([newPassword], 'Mismatch!'),
          pin: yup.string().oneOf([newPin], 'Mismatch!'),
        })}
        onSubmit={onConfirm}
      >
        {({ handleSubmit }) => (
          <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Content>
              <TextBox.Formik
                secure
                name="password"
                label="Re-enter new password"
              />
              <TextBox.Formik secure name="pin" label="Re-enter new PIN" />
              <FAB
                mode="contained"
                style={{ marginTop: 10 }}
                onPress={handleSubmit}
                label="Confirm"
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
          password: yup.string().required('Required!'),
          pin: yup.string().required('Required!'),
          newPassword: yup
            .string()
            .required('Required!')
            .min(8, 'Must be at least 8 characters!'),
          newPin: yup
            .string()
            .required('Required!')
            .min(4, 'Must be at least 4 characters!'),
        })}
        onSubmit={async ({ password, pin, newPassword, newPin }) => {
          try {
            await sendAPI('users/update/user', {
              password,
              pin,
              new_password: newPassword,
              new_pin: newPin,
            });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          showNotification('Password & PIN has been updated');
          goBack();
        }}
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <>
            <TextBox.Formik secure name="password" label="Current password" />
            <TextBox.Formik secure name="pin" label="Current PIN" />

            <View style={styles.newCredentials}>
              <TextBox.Formik secure name="newPassword" label="New password" />
              <TextBox.Formik secure name="newPin" label="New PIN" />
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
                  ? 'Updating Password & PIN...'
                  : 'Update Password & PIN'
              }
            />
            <ConfirmPasswordPinDialog
              visible={confirming}
              onDismiss={() => {
                setConfirming(false);
              }}
              newRecovery={values.newRecovery}
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
