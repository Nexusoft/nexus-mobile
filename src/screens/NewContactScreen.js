import React from 'react';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { createContact } from 'lib/contacts';
import { goBack } from 'lib/navigation';
import { showError } from 'lib/ui';

export default function NewContactScreen() {
  const contactNames = useSelector((state) => Object.keys(state.contacts));
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
          address: yup.string().required('Required!'),
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
        {({ isSubmitting, handleSubmit }) => (
          <>
            <TextBox.Formik name="name" label="Contact name" />
            <TextBox.Formik name="address" label="Contact's Nexus address" />
            <Button
              mode="contained"
              disabled={isSubmitting}
              style={{ marginTop: 30 }}
              onPress={handleSubmit}
            >
              Create contact
            </Button>
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
