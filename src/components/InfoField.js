import React from 'react';
import styled from '@emotion/native';

import { SubText, Text } from 'components/Adaptive';
import { disabledColor } from 'lib/theme';

const Line = styled.View(
  ({ inline }) =>
    inline && {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  ({ compact }) => ({
    paddingVertical: compact ? 12 : 20,
  })
);

const Label = styled(SubText)({
  fontSize: 14,
});

const LabelWrapper = styled.View(
  ({ expanded }) =>
    expanded && {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
);

const ValueWrapper = styled.View(
  ({ inline }) =>
    !inline && {
      marginTop: 7,
    },
  ({ bordered, theme }) =>
    bordered && {
      borderWidth: 1,
      borderColor: disabledColor(theme.foreground),
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 5,
    }
);

const Value = styled(Text)({
  fontSize: 15,
});

export default function InfoField({
  inline,
  compact,
  label,
  control,
  value,
  mono,
  bordered,
}) {
  return (
    <Line inline={inline} compact={compact}>
      <LabelWrapper expanded={!inline && !!control}>
        <Label>{label}</Label>
        {!inline && control}
      </LabelWrapper>
      <ValueWrapper inline={inline} bordered={bordered}>
        <Value inline={inline} selectable mono={mono}>
          {value}
        </Value>
      </ValueWrapper>
    </Line>
  );
}
