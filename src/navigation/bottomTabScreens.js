import React from 'react';
import { shadow } from 'react-native-paper';

import { Icon } from 'components/Typo';
import HomeIcon from 'icons/home.svg';
import TransactionIcon from 'icons/transaction.svg';
import LogoIcon from 'icons/logo-full.svg';
import HomeScreen from 'screens/HomeScreen';
import TransactionsScreen from 'screens/TransactionsScreen';

export const screens = [
  {
    name: 'Overview',
    component: HomeScreen,
    icon: HomeIcon,
    stackOptions: ({ theme }) => ({
      title: 'Overview',
      headerTitle: () => <Icon icon={LogoIcon} width={110} height={25} />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: theme.dark ? theme.background : theme.primary,
        elevation: 0,
        ...shadow(0),
      },
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
    },
  },
];

export const defaultScreen = 'Overview';
