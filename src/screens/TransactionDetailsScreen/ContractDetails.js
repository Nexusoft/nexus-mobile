import React from 'react';
import styled from '@emotion/native';

import {
  ScrollView,
  Surface,
  View,
  Text,
  SubText,
  Divider,
} from 'components/Typo';

const ContractWrapper = styled(Surface)({
  elevation: 3,
  marginBottom: 10,
});

const ContractDetailLine = styled.View({
  paddingVertical: 10,
  paddingHorizontal: 30,
});

const ContractDetailLabel = styled(SubText)({
  fontSize: 14,
  marginBottom: 7,
});

const ContractDetailValue = styled(Text)({
  fontSize: 15,
});

const ContractDetail = ({ label, value }) => (
  <ContractDetailLine>
    <ContractDetailLabel>{label}</ContractDetailLabel>
    <ContractDetailValue selectable>{value}</ContractDetailValue>
  </ContractDetailLine>
);

export default function ContractDetails({ contract }) {
  return (
    !!contract && (
      <ContractWrapper>
        {Object.entries(contract).map(([key, value], i) => (
          <React.Fragment key={key}>
            {i !== 0 && <Divider inset={30} />}
            <ContractDetail label={key} value={value} />
          </React.Fragment>
        ))}
      </ContractWrapper>
    )
  );
}
