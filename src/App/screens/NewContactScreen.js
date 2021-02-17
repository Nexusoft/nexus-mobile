import React from 'react';
import { FAB } from 'react-native-paper';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import AddressPicker from 'components/AddressPicker';
import { createContact } from 'lib/contacts';
import { goBack } from 'lib/navigation';
import { showError } from 'lib/ui';
import memoize from 'utils/memoize';

const selectContactNames = memoize(
  (contacts) => Object.keys(contacts),
  (state) => [state?.contacts]
);
const selectContactAddresses = memoize(
  (contacts) => Object.values(contacts).map((contact) => contact.address),
  (state) => [state?.contacts]
);

export default function NewContactScreen() {
  const contactNames = useSelector(selectContactNames);
  const contactAddresses = useSelector(selectContactAddresses);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          name: '',
          address: '',
        }}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .required('Required!')
            .notOneOf(contactNames, 'Existed!'),
          address: yup
            .string()
            .required('Required!')
            .notOneOf(contactAddresses, 'Existed!'),
        })}
        onSubmit={async ({ name, address }) => {
          try {
            await createContact({ name, address });
            goBack();
          } catch (err) {
            showError(err && err.message);
          }
        }}
      >
        {({ isSubmitting, handleSubmit, setFieldValue }) => (
          <>
            <TextBox.Formik
              autoFocus
              name="name"
              label="Contact name"
              autoCapitalize="words"
            />
            <TextBox.Formik name="address" label="Nexus address" multiline />
            <AddressPicker
              pickContacts={false}
              setAddress={(address) => {
                setFieldValue('address', address);
              }}
            />
            <FAB
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={{ marginTop: 30 }}
              onPress={handleSubmit}
              label="Create contact"
            />
          </>
        )}
      </Formik>
    </ScreenBody>
  );
}

NewContactScreen.nav = {
  name: 'NewContact',
  options: {
    title: 'New Contact',
  },
};
