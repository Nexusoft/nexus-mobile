import React from 'react';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { refreshUserStatus } from 'lib/user';
import { sendAPI } from 'lib/api';
import { goBack } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';

export default function SetRecoveryScreen() {
  const hasRecoveryPhrase = useSelector(
    (state) => !!state.user?.status?.recovery
  );
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          password: '',
          pin: '',
          recovery: '',
          newRecovery: '',
        }}
        validationSchema={yup.object().shape({
          password: yup.string().required('Required!'),
          pin: yup.string().required('Required!'),
          recovery: hasRecoveryPhrase
            ? yup.string().required('Required!')
            : undefined,
          newRecovery: yup.string().required('Required!'),
        })}
        onSubmit={async ({ password, pin, recovery, newRecovery }) => {
          try {
            await sendAPI('users/update/user', {
              password,
              pin,
              recovery: hasRecoveryPhrase ? recovery : undefined,
              new_recovery: newRecovery,
            });
          } catch (err) {
            showError(err && err.message);
            return;
          }
          refreshUserStatus();
          showNotification('Recovery phrase has been updated');
          goBack();
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <TextBox.Formik secure name="password" label="Password" />
            <TextBox.Formik secure name="pin" label="PIN" />
            {hasRecoveryPhrase && (
              <TextBox.Formik
                multiline
                name="recovery"
                label="Current recovery phrase"
              />
            )}
            <TextBox.Formik
              multiline
              name="newRecovery"
              label="New recovery phrase"
            />
            <FAB
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={{ marginTop: 30 }}
              onPress={handleSubmit}
              label="Update recovery phrase"
            />
          </>
        )}
      </Formik>
    </ScreenBody>
  );
}

SetRecoveryScreen.nav = {
  name: 'SetRecovery',
  options: {
    title: 'Recovery phrase',
  },
};
