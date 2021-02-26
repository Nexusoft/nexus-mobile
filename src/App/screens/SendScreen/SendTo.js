import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { Button, FAB, overlay } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import TokenName from 'components/TokenName';
import AddressPicker from 'components/AddressPicker';
import { useTheme } from 'lib/theme';
import { callAPI } from 'lib/api';
import { navigate } from 'lib/navigation';
import formatNumber from 'utils/formatNumber';
import { addressRegex } from 'consts/regex';
import { getStore } from 'store';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: overlay(2, theme.surface),
    paddingHorizontal: 30,
    paddingVertical: 20,
  }),
  heading: {
    textTransform: 'uppercase',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.75,
  },
  sendAll: {
    alignSelf: 'flex-end',
    marginTop: -15,
  },
  section: {
    marginBottom: 30,
  },
  advancedToggle: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  advancedOptions: ({ expanded }) => ({
    // setting height to 0 makes text have the stretch effect
    // setting height to > 0 makes text have the revealing effect (on Android)
    height: expanded ? undefined : 0.01,
    overflow: 'hidden',
    alignSelf: 'stretch',
  }),
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
  return contact?.[0];
}

async function resolveNameOrAddress(nameOrAddress) {
  if (!nameOrAddress) return null;

  if (addressRegex.test(nameOrAddress)) {
    const addressResult = await callAPI('system/validate/address', {
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
    const nameResult = await callAPI('names/get/name', { name: nameOrAddress });
    return {
      name: nameOrAddress,
      address: nameResult.register_address,
      contactName: findContactName(nameResult.register_address),
    };
  } catch (err) {
    try {
      const nameResult = await callAPI('names/get/name', {
        name: `${nameOrAddress}:default`,
      });
      return {
        name: `${nameOrAddress}:default`,
        address: nameResult.register_address,
        contactName: findContactName(nameResult.register_address),
      };
    } catch (err) {
      return null;
    }
  }
}

export default function SendTo({ account }) {
  const theme = useTheme();
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  return (
    <Formik
      initialValues={{
        amount: '',
        nameOrAddress: '',
        reference: '',
      }}
      validationSchema={yup.object().shape({
        nameOrAddress: yup.string().required('Required!'),
        amount: yup.number().typeError('Invalid!').min(0, 'Invalid!'),
        reference: yup
          .number()
          .typeError('Invalid!')
          .integer('Invalid!')
          .min(0, 'Invalid!'),
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
        <View style={styles.wrapper({ theme })}>
          <Text style={styles.heading}>Send to</Text>

          <View style={styles.section}>
            <TextBox.Formik
              multiline
              name="nameOrAddress"
              mode="outlined"
              background={['surface', 2]}
              label="Recipient name/address"
              blurOnSubmit
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
              label={`Amount (${TokenName.from({ account })})`}
              keyboardType="numeric"
            />
            <Button
              mode="text"
              style={styles.sendAll}
              onPress={() => {
                setFieldValue('amount', String(account.balance));
              }}
              labelStyle={{ fontSize: 12 }}
            >
              Send all (
              {formatNumber(account.balance, { maximumFractionDigits: 6 })}{' '}
              {TokenName.from({ account })})
            </Button>
          </View>

          <View style={styles.section}>
            <Button
              mode="text"
              compact
              icon={advancedOpen ? 'chevron-down' : 'chevron-right'}
              style={styles.advancedToggle}
              labelStyle={{ fontSize: 12 }}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setAdvancedOpen(!advancedOpen);
              }}
            >
              Advanced options
            </Button>

            <View style={styles.advancedOptions({ expanded: advancedOpen })}>
              <TextBox.Formik
                name="reference"
                mode="outlined"
                background={['surface', 2]}
                label="Reference number (optional)"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <FAB
            style={styles.send}
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            label={isSubmitting ? 'Validating...' : 'Proceed'}
          />
        </View>
      )}
    </Formik>
  );
}
