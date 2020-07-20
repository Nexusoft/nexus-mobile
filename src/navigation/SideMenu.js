import React from 'react';
import { View, Platform, ScrollView } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useTheme } from 'lib/theme';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import { logout } from 'lib/user';
import { confirm } from 'lib/ui';
import UserIcon from 'icons/user.svg';
import TokenIcon from 'icons/token.svg';
import NameIcon from 'icons/abc.svg';
import NamespaceIcon from 'icons/abc-cube.svg';
import AssetIcon from 'icons/asset.svg';
import WalletIcon from 'icons/wallet.svg';
import CopyIcon from 'icons/copy.svg';
import LogoutIcon from 'icons/logout.svg';

const styles = {
  wrapper: {
    flex: 1,
  },
  header: ({ theme }) => ({
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  topArea: {
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userArea: {
    paddingTop: 25,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: ({ theme }) => ({
    marginRight: 15,
    color: theme.dark ? theme.foreground : theme.onPrimary,
  }),
  userName: ({ theme }) => ({
    fontSize: 24,
    color: theme.dark ? theme.foreground : theme.onPrimary,
  }),
  items: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
};

async function confirmLogout({ closeDrawer }) {
  const confirmed = await confirm({
    title: 'Are you sure you want to log out?',
    confirmLabel: 'Log out',
    danger: true,
  });
  if (confirmed) {
    await logout();
    closeDrawer();
  }
}

const MenuItem = ({ linkTo, icon, label, action }) => (
  <TouchableRipple
    borderless={false}
    onPress={() => {
      if (linkTo) {
        navigate(linkTo);
      } else if (action) {
        action();
      }
    }}
  >
    <View style={styles.item}>
      {!!icon && <SvgIcon style={styles.itemIcon} icon={icon} size={15} />}
      <Text emphasis size={15}>
        {label}
      </Text>
    </View>
  </TouchableRipple>
);

export default function SideMenu({ navigation }) {
  const theme = useTheme();
  return (
    <View style={styles.wrapper}>
      <View style={styles.header({ theme })}>
        <View style={styles.topArea}>
          <IconButton
            icon="arrow-left"
            size={25}
            color={theme.dark ? theme.foreground : theme.onPrimary}
            onPress={() => {
              navigation.closeDrawer();
            }}
          />
        </View>

        <View style={styles.userArea}>
          <View style={styles.userInfo}>
            <SvgIcon
              style={styles.avatar({ theme })}
              icon={UserIcon}
              size={25}
            />
            <Text style={styles.userName({ theme })}>krysto</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.items}>
        <MenuItem linkTo="Accounts" icon={WalletIcon} label="Accounts" />
        <MenuItem linkTo="Tokens" icon={TokenIcon} label="Tokens" />
        <MenuItem linkTo="Assets" icon={AssetIcon} label="Assets" />
        <MenuItem linkTo="Names" icon={NameIcon} label="Names" />
        <MenuItem linkTo="Namespaces" icon={NamespaceIcon} label="Namespaces" />
        <Divider spacing={5} />

        <MenuItem icon={CopyIcon} label="Copy User ID to clipboard" />
        <MenuItem
          icon={LogoutIcon}
          label="Log out"
          action={() => {
            confirmLogout({ closeDrawer: navigation.closeDrawer });
          }}
        />
        <Divider spacing={5} />

        <MenuItem label="About Nexus Wallet" />
      </ScrollView>
    </View>
  );
}
