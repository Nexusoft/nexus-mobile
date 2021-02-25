import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useTheme } from 'lib/theme';

export default function ScreenBody({
  children,
  scroll = true,
  surface,
  primary,
  style,
  refreshControl,
  ...rest
}) {
  const theme = useTheme();
  const ScreenWrapper = scroll ? ScrollView : View;
  return (
    <TouchableWithoutFeedback onPress={scroll ? undefined : Keyboard.dismiss}>
      <ScreenWrapper
        style={[
          { flex: 1 },
          primary
            ? { backgroundColor: theme.primary }
            : surface
            ? { backgroundColor: theme.surface }
            : null,
        ]}
        keyboardShouldPersistTaps={scroll ? 'handled' : undefined}
        refreshControl={refreshControl}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[{ flex: 1 }, style]} {...rest}>
            {children}
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}
