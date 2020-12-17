import React from 'react';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { confirmPin, showError } from 'lib/ui';
import { sendAPI } from 'lib/api';
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
          const pin = await confirmPin({ fee: createLocalNameFee });
          if (pin !== null) {
            try {
              await sendAPI('finance/create/account', {
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
        {({ handleSubmit, isSubmitting }) => (
          <>
            <TextBox.Formik
              autoFocus
              name="name"
              label="Account name (optional)"
            />
            <FAB
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ marginTop: 30 }}
              onPress={handleSubmit}
              label="Create account"
            />
          </>
        )}
      </Formik>
    </ScreenBody>
  );
}

NewAccountScreen.nav = {
  name: 'NewAccount',
  options: {
    title: 'New Account',
  },
};
