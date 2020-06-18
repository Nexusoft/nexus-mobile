import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from 'emotion-theming';

import { ScrollView } from 'components/Adaptive';

export default function ScreenBody({
  children,
  scroll = true,
  surface,
  style,
  ...rest
}) {
  const theme = useTheme();
  const ScreenWrapper = scroll ? ScrollView : View;
  return (
    <ScreenWrapper
      style={[{ flex: 1 }, surface ? { backgroundColor: theme.surface } : null]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[{ flex: 1 }, style]} {...rest}>
          {children}
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
