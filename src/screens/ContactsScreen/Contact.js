import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Text from 'components/Text';
import { lighten, darken } from 'utils/color';
import { navigate } from 'lib/navigation';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftPart: {
    paddingVertical: 20,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: ({ theme }) => ({
    backgroundColor: theme.dark
      ? lighten(theme.surface, 0.6)
      : darken(theme.surface, 0.15),
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  initLetter: {
    textTransform: 'uppercase',
    fontSize: 21,
  },
  contactName: {
    fontSize: 18,
  },
  rightPart: {
    flex: 1,
  },
};

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function Contact({ contact }) {
  const theme = useTheme();
  return (
    <TouchableRipple
      onPress={() => {
        navigate('ContactDetails', { contact });
      }}
    >
      <View style={styles.wrapper}>
        <View style={styles.leftPart}>
          <View style={styles.avatar({ theme })}>
            <Text style={styles.initLetter} sub>
              {getinitial(contact.name)}
            </Text>
          </View>
        </View>

        <View style={styles.rightPart}>
          <Text style={styles.contactName}>{contact.name}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
}
