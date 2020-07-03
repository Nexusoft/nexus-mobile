import React from 'react';
import { View, Clipboard, StyleSheet, Vibration } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IconButton, Portal } from 'react-native-paper';

import { Icon } from 'components/Adaptive';
import QRIcon from 'icons/qr.svg';
import PasteIcon from 'icons/paste.svg';
import AddressBookIcon from 'icons/address-book.svg';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    marginVertical: 0,
    marginTop: -20,
  },
};

export default function AddressPicker({ pickContacts = true, setAddress }) {
  const [scanning, setScanning] = React.useState(false);
  return (
    <View style={styles.wrapper}>
      <IconButton
        style={styles.button}
        icon={() => <Icon icon={PasteIcon} size={16} />}
        onPress={async () => {
          const clipboard = await Clipboard.getString();
          if (clipboard) {
            setAddress(clipboard);
          }
        }}
      />
      {pickContacts && (
        <IconButton
          style={styles.button}
          icon={() => <Icon icon={AddressBookIcon} size={16} />}
          onPress={async () => {}}
        />
      )}
      <IconButton
        style={styles.button}
        icon={() => <Icon icon={QRIcon} size={16} />}
        onPress={async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          if (status === 'granted') {
            setScanning(true);
          }
        }}
      />
      {scanning && (
        <Portal>
          <BarCodeScanner
            style={StyleSheet.absoluteFill}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={({ data }) => {
              Vibration.vibrate();
              setAddress(data);
              setScanning(false);
            }}
          />
        </Portal>
      )}
    </View>
  );
}
