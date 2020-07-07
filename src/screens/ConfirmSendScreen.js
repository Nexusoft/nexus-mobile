import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import PinDialog from 'components/PinDialog';
import { goBack } from 'lib/navigation';
import NextIcon from 'icons/next.svg';
import WalletIcon from 'icons/wallet.svg';
import SendIcon from 'icons/send.svg';
import ContactsIcon from 'icons/address-book.svg';

const styles = {
  wrapper: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  fromToSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  referenceSection: {
    alignItems: 'center',
  },
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
  },
  fromTo: {
    flex: 1,
    alignItems: 'center',
  },
  amount: {
    fontSize: 36,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    marginBottom: 10,
  },
  address: {
    textAlign: 'center',
  },
  arrow: {
    paddingTop: 38,
    paddingHorizontal: 5,
  },
  referenceNo: {
    fontSize: 20,
  },
  cancel: {
    marginRight: 15,
  },
  confirm: {
    flex: 1,
  },
};

export default function ConfirmSendScreen() {
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <ScreenBody style={styles.wrapper} surface>
      <View style={styles.amountSection}>
        <Text style={styles.label} sub>
          You're sending
        </Text>
        <Text style={styles.amount}>3,525 NXS</Text>
      </View>

      <View style={styles.fromToSection}>
        <View style={styles.fromTo}>
          <Text style={styles.label} sub>
            From
          </Text>
          <Text style={styles.name}>
            <SvgIcon icon={WalletIcon} size={20} /> default
          </Text>
          <Text style={styles.address} mono>
            8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW
          </Text>
        </View>
        <View style={styles.arrow}>
          <SvgIcon icon={NextIcon} size={16} />
        </View>
        <View style={styles.fromTo}>
          <Text style={styles.label} sub>
            To
          </Text>
          <Text style={styles.name}>
            <SvgIcon icon={ContactsIcon} size={20} /> Paul
          </Text>
          <Text style={styles.address} mono>
            8C53PdQLuXamTiWw3yXS8fVB4c2eQSwvmssHYzWfLsr5Wtj4jHr
          </Text>
        </View>
      </View>

      <View style={styles.referenceSection}>
        <Text style={styles.label} sub size={16}>
          Reference number
        </Text>
        <Text style={styles.referenceNo}>942189</Text>
      </View>

      <View style={styles.buttonSection}>
        <Button
          style={styles.cancel}
          mode="outlined"
          onPress={() => {
            goBack();
          }}
        >
          Cancel
        </Button>
        <Button
          style={styles.confirm}
          mode="contained"
          icon={({ size, color }) => (
            <SvgIcon icon={SendIcon} {...{ size, color }} />
          )}
          onPress={() => {
            setConfirmingPin(true);
          }}
        >
          Send transaction
        </Button>
      </View>

      <PinDialog
        visible={confirmingPin}
        onDismiss={() => {
          setConfirmingPin(false);
        }}
      />
    </ScreenBody>
  );
}

ConfirmSendScreen.nav = {
  name: 'ConfirmSend',
  options: {
    title: 'Confirm Send',
  },
};
