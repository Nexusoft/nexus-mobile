import React from 'react';
import { View, ScrollView, Clipboard } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from 'lib/theme';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import Divider from 'components/Divider';
import { showNotification } from 'lib/ui';
import segmentAddress from 'utils/segmentAddress';
import { flatHeader } from 'utils/styles';
import CopyIcon from 'icons/copy.svg';

const styles = {
  wrapper: ({ theme }) => ({
    backgroundColor: theme.dark ? theme.background : theme.primary,
    flex: 1,
    paddingHorizontal: 20,
  }),
  topInstruction: {
    marginBottom: 30,
    alignItems: 'center',
  },
  main: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 20,
    elevation: 5,
  },
  address: {
    marginTop: 30,
  },
  separator: {
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  separatorLine: {
    flex: 1,
    top: 2,
  },
  separatorLabel: {
    paddingHorizontal: 15,
  },
};

export default function ReceiveScreen({ route }) {
  const theme = useTheme();
  const address = route.params?.account?.address;
  return (
    <ScrollView
      style={styles.wrapper({ theme })}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        paddingTop: 20,
        paddingBottom: 60,
      }}
    >
      <View>
        <Surface style={styles.main}>
          <View style={styles.topInstruction}>
            <Text sub>Show this QR code to the sender</Text>
          </View>

          {/* always dark on light, scanners can fail on inverted codes */}
          <QRCode
            value={address}
            size={200}
            color="#000"
            backgroundColor="#fff"
            quietZone={10}
          />

          <Text mono style={styles.address}>
            {segmentAddress(address)}
          </Text>

          <View style={styles.separator}>
            <Divider style={styles.separatorLine} />
            <Text style={styles.separatorLabel} disabled>
              or
            </Text>
            <Divider style={styles.separatorLine} />
          </View>

          <Button
            style={{ alignSelf: 'stretch' }}
            mode="outlined"
            uppercase={false}
            icon={({ size }) => <SvgIcon icon={CopyIcon} size={size} />}
            onPress={() => {
              Clipboard.setString(address);
              showNotification('Copied to clipboard');
            }}
          >
            <Text>Copy account address</Text>
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
}

ReceiveScreen.nav = ({ theme }) => ({
  name: 'Receive',
  options: ({ route }) => ({
    headerTitleAlign: 'center',
    headerTitle: route.params?.account?.name,
    headerStyle: flatHeader(theme),
  }),
});
