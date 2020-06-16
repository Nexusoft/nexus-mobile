import React from 'react';
import { SafeAreaView, View } from 'react-native';

import { ScrollView } from 'components/Typo';

export default function ScreenBody({
  children,
  scroll = true,
  surface,
  ...rest
}) {
  const ScreenWrapper = scroll ? ScrollView : View;
  return (
    <ScreenWrapper
      style={[{ flex: 1 }, surface ? { backgroundColor: surface } : null]}
    >
      <SafeAreaView>
        <View {...rest}>{children}</View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
