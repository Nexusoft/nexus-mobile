import React from 'react';
import { useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import { confirmPin, showError } from 'lib/ui';
import { callAPI } from 'lib/api';
import { refreshUserAccounts, selectUsername } from 'lib/user';
import { goBack } from 'lib/navigation';
import { t } from 'lib/i18n';

const getFee = (nameRecord) => (nameRecord ? 0 : 1);

export default function RenameAccountScreen({ route }) {
  const {
    params: { account },
  } = route;
  const username = useSelector(selectUsername);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          name: account?.name || '',
        }}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .required(t('Required!'))
            .notOneOf(
              account?.name ? [account.name] : [],
              t('Name unchanged!')
            ),
        })}
        onSubmit={async ({ name }) => {
          let nameRecord;
          try {
            nameRecord = await callAPI('names/get/name', {
              name: `${username}:${name}`,
            });
            if (nameRecord?.register && nameRecord.register !== '0') {
              showError(
                t('The name you entered is already in use. Please choose another name.')
              );
              return;
            }
          } catch (err) {
            if (err.code === -49) {
              // Error -49: Unsupported type for name/address
              // When name is inactive
              try {
                nameRecord = await callAPI('names/get/inactive', {
                  name: `${username}:${name}`,
                });
              } catch (err2) {
                showError(err2?.message);
                return;
              }
            } else if (err.code !== -101) {
              // -101 Unknown name: (name)
              showError(err?.message);
              return;
            }
          }

          try {
            const fee = getFee(nameRecord);
            const pin = await confirmPin({ fee });
            if (pin) {
              if (account.name) {
                await callAPI('names/rename/name', {
                  pin,
                  name: account.name,
                  new: name,
                });
              } else {
                await callAPI('names/create/name', {
                  pin,
                  name,
                  register: account.address,
                });
              }

              // Success
              refreshUserAccounts();
              goBack();
            }
          } catch (err) {
            showError(err?.message);
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <TextBox.Formik autoFocus name="name" label={t('Account name')} />
            <FAB
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ marginTop: 10 }}
              onPress={handleSubmit}
              label={t('Rename account')}
            />
          </>
        )}
      </Formik>

      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

RenameAccountScreen.nav = {
  name: 'RenameAccount',
  options: {
    title: 'Rename Account',
  },
};
