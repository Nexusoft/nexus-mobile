import React from 'react';
import { Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import Divider from 'components/Divider';
import InfoField from 'components/InfoField';
import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import formatNumber from 'utils/formatNumber';

const styles = {
  subHeader: {
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  section: {
    elevation: 3,
    paddingHorizontal: 30,
  },
};

export default function CoreInfoScreen() {
  const coreInfo = useSelector((state) => state.core?.info);
  return (
    <ScreenBody>
      <Text sub style={styles.subHeader}>
        Core
      </Text>
      <Surface style={styles.section}>
        <InfoField inline label="Core version" value={coreInfo?.version} />
        <Divider />
        <InfoField
          inline
          label="LLP version"
          value={coreInfo?.protocolversion}
        />
        <Divider />
        <InfoField inline label="Host name" value={coreInfo?.hostname} />
        <Divider />
        <InfoField
          inline
          label="Timestamp"
          value={
            !!coreInfo?.timestamp
              ? moment.unix(coreInfo.timestamp).format('llll')
              : ''
          }
        />
        <Divider />
        <InfoField
          inline
          label="Multi-user mode"
          value={coreInfo?.multiuser ? 'Yes' : 'No'}
        />
        <Divider />
        <InfoField
          inline
          label="Lite mode"
          value={coreInfo?.clientmode ? 'Yes' : 'No'}
        />
      </Surface>

      <Text sub style={styles.subHeader}>
        Network
      </Text>
      <Surface style={styles.section}>
        <InfoField
          inline
          label="Active network"
          value={`${coreInfo?.private ? 'Private' : 'Public'} ${
            coreInfo?.testnet ? 'testnet ' + coreInfo.testnet : 'mainnet'
          }`}
        />
        <Divider />
        <InfoField inline label="Connections" value={coreInfo?.connections} />
        <Divider />
        <InfoField
          inline
          label="Synchronizing"
          value={coreInfo?.synchronizing ? 'Yes' : 'No'}
        />
        <Divider />
        <InfoField
          inline
          label="Sync. complete"
          value={coreInfo?.synccomplete + '%'}
        />
        <Divider />
        <InfoField
          inline
          label="Block height"
          value={
            coreInfo?.blocks
              ? formatNumber(coreInfo.blocks, { maximumFractionDigits: 0 })
              : ''
          }
        />
      </Surface>

      {/* <Text sub style={styles.subHeader}>
        Legacy
      </Text>
      <Surface style={styles.section}>
        <InfoField
          inline
          label="Legacy version"
          value={coreInfo?.walletversion}
        />
        <Divider />
        <InfoField inline label="Transactions" value={coreInfo?.txtotal} />
      </Surface> */}
    </ScreenBody>
  );
}

CoreInfoScreen.nav = {
  name: 'CoreInfo',
  options: {
    title: 'Core info',
  },
};
