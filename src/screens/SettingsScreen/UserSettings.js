import React from 'react';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Text from 'components/Text';
import SettingItem from './SettingItem';
import commonStyles from './styles';

const styles = {
  ...commonStyles,
  switch: {
    marginLeft: 10,
  },
};

export default function UserSettings() {
  return (
    <>
      <Text style={styles.title} sub>
        User
      </Text>
      <Surface style={styles.section}>
        <SettingItem
          small
          title="Change password & PIN"
          onPress={() => {}}
          right="arrow"
        />
        <Divider inset={20} />
        <SettingItem
          small
          title="Change recovery phrase"
          onPress={() => {}}
          right="arrow"
        />
      </Surface>
    </>
  );
}
