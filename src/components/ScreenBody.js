import React from 'react';
import styled from '@emotion/native';
import { SafeAreaView, View, KeyboardAvoidingView } from 'react-native';

import { ScrollView } from 'components/Typo';

const ScreenWrapper = styled(ScrollView)(
  {
    flex: 1,
  },
  ({ theme, surface }) =>
    surface && {
      backgroundColor: theme.surface,
    }
);

export default function ScreenBody({ children, surface, ...rest }) {
  return (
    <ScreenWrapper surface={surface}>
      <SafeAreaView>
        <View {...rest}>{children}</View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
