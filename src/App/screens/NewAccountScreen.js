import React from 'react';
import { View } from 'react-native';
import { FAB, Button } from 'react-native-paper';
import { Formik } from 'formik';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import TokenSelector from 'components/TokenSelector';
import TokenName from 'components/TokenName';
import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import { confirmPin, showError } from 'lib/ui';
import { callAPI } from 'lib/api';
import { refreshUserAccounts } from 'lib/user';
import { goBack } from 'lib/navigation';
import { createLocalNameFee } from 'lib/fees';

const styles = {
  tokenSection: {
    marginBottom: 20,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 16,
  },
};

export default function NewAccountScreen() {
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <Formik
        initialValues={{
          token: null,
          name: '',
        }}
        onSubmit={async ({ name }) => {
          const pin = await confirmPin({ fee: name ? createLocalNameFee : 0 });
          if (pin !== null) {
            try {
              await callAPI('finance/create/account', {
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
        {({ handleSubmit, isSubmitting, values, setValues }) => (
          <>
            <View style={styles.tokenSection}>
              <Text sub style={styles.tokenLabel}>
                Account token:
              </Text>
              <Button
                mode="text"
                labelStyle={{ fontSize: 16 }}
                onPress={() => {
                  setSelectorOpen(true);
                }}
              >
                {values.token ? TokenName.from({ token: values.token }) : 'NXS'}
              </Button>
            </View>
            <TextBox.Formik
              autoFocus
              name="name"
              label="Account name (optional)"
            />
            <Text sub style={{ textAlign: 'center', marginTop: 30 }}>
              Fee: {values.name ? createLocalNameFee : 0} NXS
            </Text>
            <FAB
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ marginTop: 10 }}
              onPress={handleSubmit}
              label="Create account"
            />

            <TokenSelector
              open={selectorOpen}
              onDismiss={() => {
                setSelectorOpen(false);
              }}
              selectedToken={values.token}
              selectToken={(token) => setValues({ token })}
            />
          </>
        )}
      </Formik>

      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

NewAccountScreen.nav = {
  name: 'NewAccount',
  options: {
    title: 'New Account',
  },
};
