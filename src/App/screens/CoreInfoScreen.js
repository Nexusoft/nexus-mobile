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
  body: {
    paddingBottom: 40,
  },
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

function displayDownloadRate(byteRate) {
  if (!byteRate) return 'N/A';
  let number = byteRate;
  let unit = 'B';
  if (byteRate > 1000000000) {
    number /= 1000000000;
    unit = 'GB';
  } else if (byteRate > 1000000) {
    number /= 1000000;
    unit = 'MB';
  }
  if (byteRate > 1000) {
    number /= 1000;
    unit = 'KB';
  }
  return `${formatNumber(number, { maximumFractionDigits: 2 })} ${unit}/s`;
}

export default function CoreInfoScreen() {
  const coreInfo = useSelector((state) => state.core?.info);
  return (
    <ScreenBody style={styles.body}>
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
          value={coreInfo?.litemode ? 'Yes' : 'No'}
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
          value={coreInfo?.syncing ? 'Yes' : 'No'}
        />
        <Divider />
        {!!coreInfo?.syncing && (
          <>
            <InfoField
              inline
              label="Sync. progress"
              value={coreInfo.syncing.progress + '%'}
            />
            <Divider />
            <InfoField
              inline
              label="Blocks"
              value={`${formatNumber(coreInfo.blocks, {
                maximumFractionDigits: 0,
              })} / ${formatNumber(coreInfo.syncing.networkBlock, {
                maximumFractionDigits: 0,
              })} (${coreInfo.syncing.completed}%)`}
            />
            <Divider />
            <InfoField
              inline
              label="Download rate"
              value={displayDownloadRate(coreInfo.syncing.downloadRate)}
            />
            <Divider />
            <InfoField
              inline
              label="Est. time remaining"
              value={coreInfo.syncing.timeRemaining}
            />
            <Divider />
          </>
        )}
        {!coreInfo?.syncing && (
          <InfoField
            inline
            label="Block height"
            value={
              coreInfo?.blocks
                ? formatNumber(coreInfo.blocks, { maximumFractionDigits: 0 })
                : ''
            }
          />
        )}
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

// function timeRemaining(secondsRemaining) {
//   const hours = Math.floor(secondsRemaining / (60 * 60));
//   const hText = hours > 0 ? `${hours} hours` : '';
//   if (hours > 9) {
//     return hText;
//   }

//   const minutes = Math.floor((secondsRemaining - hours * 60 * 60) / 60);
//   const mText = minutes > 0 ? `${minutes} minutes` : '';
//   if (hours > 0) {
//     return hText + ' ' + mText;
//   } else if (minutes > 10) {
//     return mText;
//   }

//   const seconds = secondsRemaining - hours * 60 * 60 - minutes * 60;
//   const sText = `${seconds} seconds`;
//   if (minutes > 0) {
//     return mText + ' ' + sText;
//   } else {
//     return sText;
//   }
// }
