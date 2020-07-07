import React from 'react';
import styled from '@emotion/native';
import { Surface } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';

const Wrapper = styled(ScreenBody)({});

const Section = styled(Surface)({
  elevation: 2,
  marginBottom: 20,
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
      <SectionTitle sub>Application</SectionTitle>
      <Section>
        <ApplicationSettings />
      </Section>

      <SectionTitle sub>Core</SectionTitle>
      <Section>
        <ApplicationSettings />
      </Section>
    </Wrapper>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
