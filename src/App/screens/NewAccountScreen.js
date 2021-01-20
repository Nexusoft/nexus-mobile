import React from 'react';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import { confirmPin, showError } from 'lib/ui';
import { callAPI } from 'lib/api';
import { refreshUserAccounts } from 'lib/user';
import { goBack } from 'lib/navigation';
import { createLocalNameFee } from 'lib/fees';

export default function NewAccountScreen() {
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={async ({ name }) => {
          const pin = await confirmPin({ fee: name ? createLocalNameFee : 0 });
          if (pin !== null) {
            try {
              await callAPI('finance/create/account', {
                name: name || undefined,
                pin,
              });
              refreshUserAccounts();
              goBack();
            } catch (err) {
              showError(err && err.message);
            }
          }
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <>
            <TextBox.Formik
              autoFocus
              name="name"
              label="Account name (optional)"
            />
            <Text sub style={{ textAlign: 'center', marginTop: 30 }}>
              Fee: {values.name ? createLocalNameFee : 0} NXS
            </Text>
            <FAB
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ marginTop: 10 }}
              onPress={handleSubmit}
              label="Create account"
            />
          </>
        )}
      </Formik>

      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

NewAccountScreen.nav = {
  name: 'NewAccount',
  options: {
    title: 'New Account',
  },
};
