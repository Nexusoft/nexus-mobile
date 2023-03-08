import React, { useState, useEffect } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Surface, Button, IconButton } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'lib/theme';
import RNFS from 'react-native-fs';
import SvgIcon from 'components/SvgIcon';
import RecoveryIcon from 'icons/recovery.svg';
import { showError } from 'lib/ui';

const styles = {
  screen: {
    paddingTop: 30,
  },
};

async function handleReadFile(logOutput, setLogOutput) {
  if (logOutput !== true || logOutput === 'finished') return;
  if (logOutput === true) {
    //TODO: Change this
    try {
      const fileStats = await RNFS.stat(
        (Platform.OS === 'android'
          ? RNFS.ExternalDirectoryPath
          : RNFS.DocumentDirectoryPath) + '/Nexus/client/log/0.log'
      );
      const bytestoread = 50000;
      const byteposition =
        Math.sign(fileStats.size - bytestoread) > 0
          ? fileStats.size - bytestoread
          : 0;
      const result = await RNFS.read(
        (Platform.OS === 'android'
          ? RNFS.ExternalDirectoryPath
          : RNFS.DocumentDirectoryPath) + '/Nexus/client/log/0.log',
        50000,
        byteposition,
        'ascii'
      );
      const formated = result.split(`\n`).reverse().join(`\n`);
      setLogOutput(formated);
    } catch (error) {
      showError(error?.message);
    }
  }
}

const LogOutput = () => {
  const { logOutput, setLogOutput } = EmbeddedCoreLogReaderScreen.logCallback;
  handleReadFile(logOutput, setLogOutput);
  const theme = useTheme();
  if (logOutput === true) {
    return <Text style={{ color: theme.foreground }}>Loading</Text>;
  } else {
    return (
      <TextInput multiline editable={false} style={{ color: theme.foreground }}>
        {logOutput}
      </TextInput>
    );
  }
};

const UpdateLog = () => {
  EmbeddedCoreLogReaderScreen.logCallback.setLogOutput(true);
};

export default function EmbeddedCoreLogReaderScreen({ navigation }) {
  const [logOutput, setLogOutput] = useState(true);
  EmbeddedCoreLogReaderScreen.logCallback = { logOutput, setLogOutput };
  return (
    <ScreenBody style={styles.screen}>
      <ScrollView style={{ margin: 10, flex: 1 }}>
        <LogOutput />
      </ScrollView>
    </ScreenBody>
  );
}

//TODO: Change?
EmbeddedCoreLogReaderScreen.logCallback;

EmbeddedCoreLogReaderScreen.nav = {
  name: 'EmbeddedCoreLogReader',
  options: {
    title: 'Core Log',
    headerRight: ({ tintColor }) => (
      <IconButton
        icon={({ size }) => (
          <SvgIcon icon={RecoveryIcon} size={size} color={tintColor} />
        )}
        color={tintColor}
        size={25}
        onPress={() => {
          UpdateLog();
        }}
      />
    ),
  },
};
