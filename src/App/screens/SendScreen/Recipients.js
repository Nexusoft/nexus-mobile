import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Button, FAB, overlay } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import AddressPicker from 'components/AddressPicker';
import { useTheme, disabledColor } from 'lib/theme';
import { sendAPI } from 'lib/api';
import { navigate } from 'lib/navigation';
import { getStore } from 'store';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: overlay(2, theme.surface),
    paddingHorizontal: 30,
    paddingVertical: 30,
  }),
  heading: {
    textTransform: 'uppercase',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  sendAll: {
    alignSelf: 'flex-end',
    marginTop: -20,
  },
  section: {
    marginBottom: 30,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 10,
  }),
  address: {
    fontSize: 15,
    textAlign: 'center',
  },
  send: {
    marginTop: 10,
  },
};

function findContactName(addr) {
  const store = getStore();
  const state = store.getState();
  const contact = Object.entries(state.contacts).find(
    ([name, { address }]) => address === addr
  );
  return contact && contact[0];
}

async function resolveNameOrAddress(nameOrAddress) {
  if (!nameOrAddress) return null;

  if (
    nameOrAddress.length === 51 &&
    nameOrAddress.match(/([0OIl+/])/g) === null
  ) {
    const addressResult = await sendAPI('system/validate/address', {
      address: nameOrAddress,
    });
    if (addressResult.is_valid) {
      // This is a Nexus address
      return {
        address: nameOrAddress,
        contactName: findContactName(nameOrAddress),
      };
    }
  }

  // This is a name
  try {
    const nameResult = await sendAPI('names/get/name', { name: nameOrAddress });
    return {
      name: nameOrAddress,
      address: nameResult.address,
      contactName: findContactName(nameResult.address),
    };
  } catch (err) {
    return null;
  }
}

export default function Recipients({ account }) {
  const theme = useTheme();

  return (
    <Formik
      initialValues={{
        amount: '',
        nameOrAddress: '',
        reference: '',
      }}
      validationSchema={yup.object().shape({
        nameOrAddress: yup.string().required('Required!'),
        amount: yup.number().min(0, 'Invalid!'),
      })}
      onSubmit={async (
        { nameOrAddress, amount, reference },
        { setFieldError }
      ) => {
        const resolved = await resolveNameOrAddress(nameOrAddress);
        if (resolved) {
          navigate('ConfirmSend', {
            account,
            recipient: resolved,
            amount,
            reference,
          });
        } else {
          setFieldError('nameOrAddress', 'Invalid name/address!');
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue }) => (
        <ScrollView style={styles.wrapper({ theme })}>
          <Text style={styles.heading}>Send to</Text>

          <View style={styles.section}>
            <TextBox.Formik
              multiline
              name="nameOrAddress"
              mode="outlined"
              background={['surface', 2]}
              label="Recipient name/address"
            />
            <AddressPicker
              setAddress={(address) => {
                setFieldValue('nameOrAddress', address);
              }}
            />
          </View>

          <View style={styles.section}>
            <TextBox.Formik
              name="amount"
              mode="outlined"
              background={['surface', 2]}
              label="Amount (NXS)"
              keyboardType="numeric"
            />
            <Button
              mode="text"
              style={styles.sendAll}
              title=""
              onPress={() => {}}
            >
              Send all
            </Button>
          </View>

          <View style={styles.section}>
            <TextBox.Formik
              name="reference"
              mode="outlined"
              background={['surface', 2]}
              label="Reference number (optional)"
              keyboardType="number-pad"
            />
          </View>

          <FAB
            style={styles.send}
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            label={isSubmitting ? 'Validating...' : 'Proceed'}
          />
        </ScrollView>
      )}
    </Formik>
  );
}
