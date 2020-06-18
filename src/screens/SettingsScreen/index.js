import React from 'react';
import styled from '@emotion/native';

import ScreenBody from 'components/ScreenBody';
import { Surface, SubText } from 'components/Adaptive';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';

const Wrapper = styled(ScreenBody)({});

const Section = styled(Surface)({
  elevation: 2,
  marginBottom: 20,
});

const SectionTitle = styled(SubText)({
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
      <Section>
        <ApplicationSettings />
      </Section>

      <SectionTitle>Core</SectionTitle>
      <Section>
        <ApplicationSettings />
      </Section>
    </Wrapper>
  );
}
