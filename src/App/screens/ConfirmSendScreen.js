import React from 'react';
import { View } from 'react-native';
import { FAB, Button } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import PinDialog from 'components/PinDialog';
import { useTheme, disabledColor } from 'lib/theme';
import { goBack } from 'lib/navigation';
import formatNumber from 'utils/formatNumber';
import segmentAddress from 'utils/segmentAddress';
import NextIcon from 'icons/next.svg';
import WalletIcon from 'icons/wallet.svg';
import SendIcon from 'icons/send.svg';
import ContactsIcon from 'icons/address-book.svg';
import NameIcon from 'icons/abc.svg';

const styles = {
  wrapper: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  fromToSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  referenceSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
  },
  fromTo: {
    flex: 1,
    marginBottom: 20,
  },
  amount: {
    fontSize: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    marginLeft: 8,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  }),
  address: {
    fontSize: 15,
    textAlign: 'center',
  },
  arrow: {
    paddingVertical: 20,
    alignSelf: 'center',
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

export default function ConfirmSendScreen({ route }) {
  const theme = useTheme();
  const { account, recipient, amount, reference } = route.params || {};
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <ScreenBody style={styles.wrapper} surface>
      <View style={styles.amountSection}>
        <Text style={styles.label} sub>
          You're sending
        </Text>
        <Text style={styles.amount}>
          {formatNumber(amount, { maximumFractionDigits: 6 })} NXS
        </Text>
      </View>

      <View style={styles.fromTo}>
        <Text style={styles.label} sub>
          From
        </Text>
        <View style={styles.accountInfo}>
          <SvgIcon icon={WalletIcon} size={16} />
          <Text bold style={styles.name}>
            {account.name}
          </Text>
        </View>
        <View style={styles.addressBox({ theme })}>
          <Text mono style={styles.address}>
            {segmentAddress(account.address)}
          </Text>
        </View>
      </View>

      <View style={styles.fromTo}>
        <Text style={styles.label} sub>
          To
        </Text>
        {!!(recipient.name || recipient.contactName) && (
          <View style={styles.accountInfo}>
            <SvgIcon
              icon={recipient.name ? NameIcon : ContactsIcon}
              size={16}
            />
            <Text bold style={styles.name}>
              {recipient.name || recipient.contactName}
            </Text>
          </View>
        )}
        <View style={styles.addressBox({ theme })}>
          <Text mono style={styles.address}>
            {segmentAddress(recipient.address)}
          </Text>
        </View>
      </View>

      {(!!reference || reference === 0) && (
        <View style={styles.referenceSection}>
          <Text style={styles.label} sub size={16}>
            Reference number
          </Text>
          <Text style={styles.referenceNo}>942189</Text>
        </View>
      )}

      <View style={styles.buttonSection}>
        <Button
          style={styles.cancel}
          mode="text"
          onPress={() => {
            goBack();
          }}
        >
          Cancel
        </Button>
        <FAB
          style={styles.confirm}
          mode="contained"
          icon={({ size, color }) => (
            <SvgIcon icon={SendIcon} {...{ size, color }} />
          )}
          onPress={() => {
            setConfirmingPin(true);
          }}
          label="Send"
        />
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
    title: 'Confirm Transaction',
  },
};
