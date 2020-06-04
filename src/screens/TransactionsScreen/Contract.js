import React from 'react';
import styled from '@emotion/native';

import { Text } from 'components/Typo';

const ContractWrapper = styled.View({
  padding: 20,
  paddingLeft: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ContractContent = styled.View({
  flex: 1,
});

const Operation = styled(Text)({
  textTransform: 'uppercase',
});

const Delta = styled(Text)({
  fontSize: 15,
});

export default function Contract({ contract }) {
  return (
    <ContractWrapper>
      <ContractContent>
        <Operation>{contract.OP}</Operation>
      </ContractContent>

      <Delta>+2.527 NXS</Delta>
    </ContractWrapper>
  );
}
