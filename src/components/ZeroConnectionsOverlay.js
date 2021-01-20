import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';

const styles = {
  container: ({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    elevation: 16,
  }),
  message: { textAlign: 'center', marginTop: 20 },
};

export default function ZeroConnectionsOverlay() {
  const theme = useTheme();
  const connections = useSelector((state) => state.core.info?.connections);
  const privateNet = useSelector((state) => state.core.info?.private);
  return (
    // !connections &&
    // !privateNet &&
    <View style={styles.container({ theme })}>
      <ActivityIndicator animating color={theme.foreground} />
      <Text sub color={theme.foreground} size={18} style={styles.message}>
        Please wait while we connect you to the network...
      </Text>
    </View>
  );
}
