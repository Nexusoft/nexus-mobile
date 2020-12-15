import React from 'react';
import { useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { confirmPin, showError } from 'lib/ui';
import { sendAPI } from 'lib/api';
import { refreshUserAccounts } from 'lib/user';
import { goBack } from 'lib/navigation';

export default function RenameAccountScreen({ route }) {
  const {
    params: { account },
  } = route;
  const username = useSelector((state) => state.user.status?.username);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          name: account?.name || '',
        }}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .required('Required!')
            .notOneOf(account?.name ? [account.name] : [], 'Name unchanged!'),
        })}
        onSubmit={async ({ name }) => {
          let nameRecord;
          try {
            nameRecord = await sendAPI('names/get/name', {
              name: `${username}:${name}`,
            });
            if (
              nameRecord?.register_address &&
              nameRecord.register_address !== '0'
            ) {
              showError(
                'The name you entered is already in use. Please choose another name.'
              );
              return;
            }
          } catch (err) {
            if (err.code !== -101) {
              showError(err && err.message);
              return;
            }
          }

          try {
            const pin = await confirmPin();
            if (pin !== null) {
              await sendAPI(
                nameRecord ? 'names/update/name' : 'names/create/name',
                {
                  pin,
                  name,
                  register_address: account?.address,
                }
              );

              if (account?.name) {
                await sendAPI('names/update/name', {
                  pin,
                  name: account.name,
                  register_address: '0',
                });
              }

              // Success
              refreshUserAccounts();
              goBack();
            }
          } catch (err) {
            showError(err && err.message);
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <TextBox.Formik autoFocus name="name" label="Account name" />
            <Text sub style={{ textAlign: 'center', marginTop: 30 }}>
              Fee: {account?.name ? 2 : 1} NXS
            </Text>
            <FAB
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ marginTop: 10 }}
              onPress={handleSubmit}
              label="Rename account"
            />
          </>
        )}
      </Formik>
    </ScreenBody>
  );
}

RenameAccountScreen.nav = {
  name: 'RenameAccount',
  options: {
    title: 'Rename Account',
  },
};
