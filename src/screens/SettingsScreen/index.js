import React from 'react';
import { Surface } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';

const styles = {
  section: {
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
};

export default function SettingsScreen() {
  return (
    <ScreenBody>
      <Text style={styles.title} sub>
        Application
      </Text>
      <Surface style={styles.section}>
        <ApplicationSettings />
      </Surface>

      <Text style={styles.title} sub>
        Core
      </Text>
      <Surface style={styles.section}>
        <ApplicationSettings />
      </Surface>
    </ScreenBody>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
