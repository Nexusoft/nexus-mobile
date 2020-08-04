import React from 'react';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import InfoField from 'components/InfoField';

const styles = {
  wrapper: {
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
};

export default function ContractDetails({ contract }) {
  return (
    !!contract && (
      <Surface style={styles.wrapper}>
        {Object.entries(contract).map(([key, value], i) => (
          <React.Fragment key={key}>
            {i !== 0 && <Divider />}
            <InfoField compact label={key} value={value} />
          </React.Fragment>
        ))}
      </Surface>
    )
  );
}
