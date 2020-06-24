import React from 'react';
import { Platform, KeyboardAvoidingView, View } from 'react-native';
import { Portal as PaperPortal } from 'react-native-paper';

export default function Portal({ children, ...rest }) {
  return (
    <PaperPortal {...rest}>
      <KeyboardAvoidingView
        pointerEvents="box-none"
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View pointerEvents="box-none" style={{ flex: 1 }}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </PaperPortal>
  );
}
