import React from 'react';
import { View, Clipboard } from 'react-native';
import styled from '@emotion/native';
import { IconButton } from 'react-native-paper';

import { Icon } from 'components/Adaptive';
import QRIcon from 'icons/qr.svg';
import PasteIcon from 'icons/paste.svg';
import AddressBookIcon from 'icons/address-book.svg';

const Wrapper = styled.View({});

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
        icon={() => <Icon icon={PasteIcon} size={16} />}
        onPress={async () => {
          const clipboard = await Clipboard.getString();
          setAddress(clipboard);
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
        onPress={async () => {}}
      />
    </View>
  );
}
