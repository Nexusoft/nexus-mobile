import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { lighten, darken } from 'utils/color';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftPart: {
    paddingVertical: 20,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: ({ theme }) => ({
    backgroundColor: theme.dark
      ? lighten(theme.surface, 0.6)
      : darken(theme.surface, 0.15),
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  initLetter: {
    textTransform: 'uppercase',
    fontSize: 16,
  },
  rightPart: {
    flex: 1,
  },
  name: {
    fontSize: 15,
  },
};

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function Contact({ contact, onSelect }) {
  const theme = useTheme();
  return (
    <TouchableRipple
      onPress={() => {
        onSelect(contact.address);
      }}
    >
      <View style={styles.wrapper}>
        <View style={styles.leftPart}>
          <View style={styles.avatar({ theme })}>
            <Text sub style={styles.initLetter}>
              {getinitial(contact.name)}
            </Text>
          </View>
        </View>

        <View style={styles.rightPart}>
          <Text style={styles.name}>{contact.name}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
}
