import React from 'react';
import styled from '@emotion/native';
import { Surface } from 'react-native-paper';

import { Text } from 'components/StyledText';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';

const Wrapper = styled.View({
  flex: 1,
});

const SectionTitle = styled(Text)({
  fontSize: 14,
  marginTop: 30,
  marginBottom: 15,
  marginHorizontal: 20,
  textTransform: 'uppercase',
});

export default function SettingsScreen() {
  return (
    <Wrapper>
      <SectionTitle>Application</SectionTitle>
      <Surface>
        <ApplicationSettings />
      </Surface>

      <SectionTitle>Core</SectionTitle>
      <Surface>
        <ApplicationSettings />
      </Surface>
    </Wrapper>
  );
}
