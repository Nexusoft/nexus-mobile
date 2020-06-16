import React from 'react';
import { IconButton } from 'react-native-paper';

import { Icon } from 'components/Typo';
import SvgIcon from 'components/SvgIcon';
import { toggleTransactionsFilter } from 'lib/ui';
import HomeScreen from 'screens/HomeScreen';
import TransactionsScreen from 'screens/TransactionsScreen';
import HomeIcon from 'icons/home.svg';
import TransactionIcon from 'icons/transaction.svg';
import LogoIcon from 'icons/logo-full.svg';
import AdjustIcon from 'icons/adjust.svg';

export const screens = [
  {
    name: 'Overview',
    component: HomeScreen,
    icon: HomeIcon,
    stackOptions: ({ theme }) => ({
      title: 'Overview',
      headerTitle: () => <Icon icon={LogoIcon} width={110} height={25} />,
      headerTitleAlign: 'center',
    }),
  },
  {
    name: 'Transactions',
    component: TransactionsScreen,
    icon: TransactionIcon,
    stackOptions: {
      title: 'Transactions',
      headerTitle: 'Transactions',
      headerTitleAlign: 'left',
      headerRight: ({ tintColor }) => (
        <IconButton
          icon={({ size }) => (
            <SvgIcon icon={AdjustIcon} size={size} color={tintColor} />
          )}
          color={tintColor}
          size={25}
          onPress={() => {
            toggleTransactionsFilter();
          }}
        />
      ),
    },
  },
];

export const defaultScreen = 'Overview';
