import React from 'react';
import { useSelector } from 'react-redux';
import { Platform, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';

const styles = {
  syncing: ({ theme }) => ({
    position: 'absolute',
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.dark ? theme.surface : theme.primary,
    opacity: 0.75,
  }),
  syncingMsg: ({ theme }) => ({
    color: theme.dark ? theme.foreground : theme.onPrimary,
    fontSize: 12,
  }),
};

export default function SyncIndicator() {
  const theme = useTheme();
  const coreInfo = useSelector((state) => state.core.info);
  return (
    !!coreInfo?.synchronizing && (
      <View style={styles.syncing({ theme })} pointerEvents="none">
        <Text style={styles.syncingMsg({ theme })}>
          Synchronizing {coreInfo.synccomplete}%...
        </Text>
      </View>
    )
  );
}
