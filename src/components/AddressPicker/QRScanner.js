import React from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { IconButton, Portal } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';

import { Icon, Text } from 'components/Adaptive';
import QRIcon from 'icons/qr.svg';

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.33)',
    position: 'absolute',
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  backWrapper: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 10,
  },
};

export default function QRScanner({ setAddress, style }) {
  const [scanning, setScanning] = React.useState(false);
  const insets = useSafeArea();
  return (
    <>
      <IconButton
        style={style}
        icon={() => <Icon icon={QRIcon} size={16} />}
        onPress={async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          if (status === 'granted') {
            setScanning(true);
          }
        }}
      />
      {scanning && (
        <Portal>
          <BarCodeScanner
            style={StyleSheet.absoluteFill}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={({ data }) => {
              Vibration.vibrate();
              setAddress(data);
              setScanning(false);
            }}
          />
          <View
            style={[
              styles.header,
              {
                top: 0,
                left: insets.left,
                right: insets.right,
                height: insets.top + 60,
                paddingTop: insets.top,
              },
            ]}
          >
            <Text style={styles.title}>Scan QR code</Text>
            <View style={[styles.backWrapper, { top: insets.top }]}>
              <IconButton
                icon="arrow-left"
                size={25}
                color="#fff"
                onPress={() => {
                  setScanning(false);
                }}
              />
            </View>
          </View>
        </Portal>
      )}
    </>
  );
}
