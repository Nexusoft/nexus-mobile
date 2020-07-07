import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from 'emotion-theming';
import { ScrollView } from 'react-native-gesture-handler';

export default function ScreenBody({
  children,
  scroll = true,
  surface,
  primary,
  style,
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
