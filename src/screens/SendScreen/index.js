import React from 'react';
import styled from '@emotion/native';
import { Button, TouchableRipple } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import ScreenBody from 'components/ScreenBody';
import TextBox from 'components/TextBox';
import AddressPicker from 'components/AddressPicker';
import { navigate } from 'lib/navigation';
import AccountSelect from './AccountSelect';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const Field = styled.View({
  marginTop: 20,
});

const SendAllButton = styled(Button)({
  alignSelf: 'flex-end',
  marginTop: -20,
});

const SendButton = styled(Button)({
  marginTop: 50,
});

export default function SendScreen({ route }) {
  return (
    <Formik
      initialValues={{
        accountName: route.params?.accountName || 'default',
        recipientAddress: '',
        amount: '',
        reference: '',
      }}
      validateSchema={yup.object().shape({
        recipientAddress: yup.string().required('Required!'),
        amount: yup.number().min(0, 'Invalid!'),
      })}
      onSubmit={async () => {
        navigate('ConfirmSend');
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Wrapper surface>
          <Field>
            <AccountSelect name="accountName" options={['default', 'trust']} />
          </Field>

          <Field>
            <TextBox.Formik
              background={['surface', 0]}
              name="recipientAddress"
              multiline
              label="Send to"
              placeholder="Recipient address"
            />
            <AddressPicker
              setAddress={(address) => {
                setFieldValue('recipientAddress', address);
              }}
            />
          </Field>

          <Field>
            <TextBox.Formik
              background={['surface', 0]}
              name="amount"
              label="Amount (NXS)"
              keyboardType="numeric"
            />
            <SendAllButton
              mode="text"
              onPress={() => {}}
              labelStyle={{ fontSize: 13 }}
            >
              Send All
            </SendAllButton>
          </Field>

          <Field>
            <TextBox.Formik
              background={['surface', 0]}
              name="reference"
              label="Reference number (Optional)"
              keyboardType="number-pad"
            />
          </Field>

          <SendButton mode="contained" onPress={handleSubmit}>
            Send
          </SendButton>
        </Wrapper>
      )}
    </Formik>
  );
}

SendScreen.nav = {
  name: 'Send',
};
