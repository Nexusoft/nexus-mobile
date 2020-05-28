import React from 'react';
import styled from '@emotion/native';
import { shadow } from 'react-native-paper';

import HomeIcon from 'icons/home.svg';
import PayIcon from 'icons/pay.svg';
import SendIcon from 'icons/send.svg';
import TransactionIcon from 'icons/transaction.svg';
import LogoIcon from 'icons/logo-full.svg';
import HomeScreen from 'screens/HomeScreen';
import ReceiveScreen from 'screens/ReceiveScreen';
import SendScreen from 'screens/SendScreen';
import LinksScreen from 'screens/LinksScreen';

const Logo = styled(LogoIcon)(({ theme }) => ({
  color: theme.dark ? theme.primary : theme.onPrimary,
  height: 25,
  width: 110,
}));

export const screens = [
  {
    name: 'Home',
    component: HomeScreen,
    IconComponent: HomeIcon,
    stackOptions: ({ theme }) => ({
      title: 'Home',
      headerTitle: () => <Logo />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: theme.dark ? theme.background : theme.primary,
        elevation: 0,
        ...shadow(0),
      },
      headerTintColor: theme.dark ? theme.foreground : theme.onPrimary,
    }),
  },
  {
    name: 'Receive',
    component: ReceiveScreen,
    IconComponent: PayIcon,
    stackOptions: {
      title: 'Receive',
      headerTitle: 'Receive',
      headerTitleAlign: 'left',
    },
  },
  {
    name: 'Send',
    component: SendScreen,
    IconComponent: SendIcon,
    stackOptions: {
      title: 'Send',
      headerTitle: 'Send',
      headerTitleAlign: 'left',
    },
  },
  {
    name: 'Transactions',
    component: LinksScreen,
    IconComponent: TransactionIcon,
    stackOptions: {
      title: 'Transactions',
      headerTitle: 'Transactions',
      headerTitleAlign: 'left',
    },
  },
];

export const defaultScreen = 'Home';
