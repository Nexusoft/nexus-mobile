import React from 'react';
import styled from '@emotion/native';

import { Surface, Divider } from 'components/Typo';
import InfoField from 'components/InfoField';

const ContractWrapper = styled(Surface)({
  elevation: 3,
  marginBottom: 20,
  paddingHorizontal: 30,
});

export default function ContractDetails({ contract }) {
  return (
    !!contract && (
      <ContractWrapper>
        {Object.entries(contract).map(([key, value], i) => (
          <React.Fragment key={key}>
            {i !== 0 && <Divider />}
            <InfoField compact label={key} value={value} />
          </React.Fragment>
        ))}
      </ContractWrapper>
    )
  );
}
