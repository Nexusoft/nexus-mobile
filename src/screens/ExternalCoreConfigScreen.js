import React from 'react';
import { View, TextInput } from 'react-native';
import { Surface } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import Divider from 'components/Divider';

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
  field: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default function ExternalCoreConfigScreen() {
  return (
    <ScreenBody>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text>IP address</Text>
          <TextInput placeholder="Required" />
        </View>
      </Surface>

      <Text sub style={styles.title}>
        API server
      </Text>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text>API port</Text>
          <TextInput placeholder="Required" />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text>API username</Text>
          <TextInput placeholder="Required" />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text>API password</Text>
          <TextInput placeholder="Required" />
        </View>
      </Surface>

      <Text sub style={styles.title}>
        RPC server
      </Text>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text>RPC port</Text>
          <TextInput placeholder="Required" />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text>RPC username</Text>
          <TextInput placeholder="Required" />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text>RPC password</Text>
          <TextInput placeholder="Required" />
        </View>
      </Surface>
    </ScreenBody>
  );
}

ExternalCoreConfigScreen.nav = {
  name: 'ExternalCoreConfig',
  title: 'External Core',
};
