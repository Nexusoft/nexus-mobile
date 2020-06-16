import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from 'emotion-theming';

import { ScrollView } from 'components/Typo';

export default function ScreenBody({
  children,
  scroll = true,
  surface,
  ...rest
}) {
  const theme = useTheme();
  const ScreenWrapper = scroll ? ScrollView : View;
  return (
    <ScreenWrapper
      style={[{ flex: 1 }, surface ? { backgroundColor: theme.surface } : null]}
    >
      <SafeAreaView>
        <View {...rest}>{children}</View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
