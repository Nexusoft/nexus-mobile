import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { Button, overlay } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import TokenName from 'components/TokenName';
import AddressPicker from 'components/AddressPicker';
import { useTheme } from 'lib/theme';
import formatNumber from 'utils/formatNumber';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: overlay(2, theme.surface),
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
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
};

export default function SendTo({ account, setFieldValue }) {
  const theme = useTheme();
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  return (
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
    </View>
  );
}
