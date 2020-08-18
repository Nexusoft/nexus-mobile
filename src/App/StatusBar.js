import React from 'react';
import { View, StatusBar as NativeStatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatusBar({ backgroundColor, ...rest }) {
  const insets = useSafeAreaInsets();
  return (
    <>
      {Platform.OS === 'ios' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            height: insets.top,
            left: 0,
            right: 0,
            backgroundColor,
            zIndex: 1,
          }}
        />
      )}
      <NativeStatusBar backgroundColor={backgroundColor} {...rest} />
    </>
  );
}
