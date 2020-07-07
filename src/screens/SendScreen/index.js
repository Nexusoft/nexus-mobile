import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import ScreenBody from 'components/ScreenBody';
import TextBox from 'components/TextBox';
import AddressPicker from 'components/AddressPicker';
import { navigate } from 'lib/navigation';
import AccountSelect from './AccountSelect';

const styles = {
  wrapper: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  field: {
    marginTop: 20,
  },
  sendAll: {
    alignSelf: 'flex-end',
    marginTop: -20,
  },
  send: {
    marginTop: 50,
  },
};

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
        <ScreenBody surface style={styles.wrapper}>
          <View style={styles.field}>
            <AccountSelect name="accountName" options={['default', 'trust']} />
          </View>

          <View style={styles.field}>
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
          </View>

          <View style={styles.field}>
            <TextBox.Formik
              background={['surface', 0]}
              name="amount"
              label="Amount (NXS)"
              keyboardType="numeric"
            />
            <Button
              style={styles.sendAll}
              mode="text"
              onPress={() => {}}
              labelStyle={{ fontSize: 13 }}
            >
              Send All
            </Button>
          </View>

          <View style={styles.field}>
            <TextBox.Formik
              background={['surface', 0]}
              name="reference"
              label="Reference number (Optional)"
              keyboardType="number-pad"
            />
          </View>

          <Button style={styles.send} mode="contained" onPress={handleSubmit}>
            Send
          </Button>
        </ScreenBody>
      )}
    </Formik>
  );
}

SendScreen.nav = {
  name: 'Send',
};
