import React from 'react';
import { View, Clipboard } from 'react-native';
import { IconButton } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import PasteIcon from 'icons/paste.svg';
import ContactsSelector from './ContactsSelector';
import QRScanner from './QRScanner';

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
  return (
    <View style={styles.wrapper}>
      <IconButton
        style={styles.button}
        icon={() => <SvgIcon icon={PasteIcon} size={16} />}
        onPress={async () => {
          const clipboard = await Clipboard.getString();
          if (clipboard) {
            setAddress(clipboard);
          }
        }}
      />
      {pickContacts && (
        <ContactsSelector setAddress={setAddress} style={styles.button} />
      )}
      <QRScanner setAddress={setAddress} style={styles.button} />
    </View>
  );
}
