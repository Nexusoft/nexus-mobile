import React from 'react';
import { View, Platform } from 'react-native';
import styled from '@emotion/native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'emotion-theming';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import UserIcon from 'icons/user.svg';
import TokenIcon from 'icons/token.svg';
import NameIcon from 'icons/abc.svg';
import NamespaceIcon from 'icons/abc-cube.svg';
import AssetIcon from 'icons/asset.svg';
import WalletIcon from 'icons/wallet.svg';

const StyledSideMenu = styled.View({
  flex: 1,
});

const MenuHeader = styled(View)(({ theme }) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
}));

const TopArea = styled.View({
  marginTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
});

function BackButton(props) {
  const theme = useTheme();
  return (
    <IconButton
      icon="arrow-left"
      size={25}
      color={theme.dark ? theme.foreground : theme.onPrimary}
      {...props}
    />
  );
}

const UserArea = styled.View({
  paddingTop: 25,
  paddingBottom: 50,
  paddingHorizontal: 20,
});

const UserInfo = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const UserAvatar = styled(SvgIcon)(({ theme }) => ({
  marginRight: 15,
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const UserName = styled(Text)(({ theme }) => ({
  fontSize: 24,
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const MenuItems = styled(ScrollView)({
  flex: 1,
  paddingTop: 10,
});

const MenuItemWrapper = styled.View({
  paddingVertical: 15,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center',
});

const MenuItemIcon = styled(SvgIcon)({
  marginRight: 10,
});

const MenuItemLabel = styled(Text)({
  fontSize: 15,
});

const MenuItem = ({ linkTo, icon, label }) => (
  <TouchableRipple
    borderless={false}
    onPress={() => {
      if (linkTo) {
        navigate(linkTo);
      }
    }}
  >
    <MenuItemWrapper>
      {!!icon && <MenuItemIcon icon={icon} size={15} />}
      <MenuItemLabel emphasis>{label}</MenuItemLabel>
    </MenuItemWrapper>
  </TouchableRipple>
);

export default function SideMenu({ navigation }) {
  return (
    <StyledSideMenu>
      <MenuHeader>
        <TopArea>
          <BackButton
            onPress={() => {
              navigation.closeDrawer();
            }}
          />
        </TopArea>

        <UserArea>
          <UserInfo>
            <UserAvatar icon={UserIcon} size={25} />
            <UserName>krysto</UserName>
          </UserInfo>
        </UserArea>
      </MenuHeader>

      <MenuItems>
        <MenuItem linkTo="Accounts" icon={WalletIcon} label="Accounts" />
        <MenuItem linkTo="Tokens" icon={TokenIcon} label="Tokens" />
        <MenuItem linkTo="Assets" icon={AssetIcon} label="Assets" />
        <MenuItem linkTo="Names" icon={NameIcon} label="Names" />
        <MenuItem linkTo="Namespaces" icon={NamespaceIcon} label="Namespaces" />
        <Divider spacing={5} />

        <MenuItem label="Copy User ID to clipboard" />
        <MenuItem label="Change password & PIN" />
        <MenuItem label="Change recovery phrase" />
        <MenuItem label="Log out" />
        <Divider spacing={5} />

        <MenuItem label="About Nexus Wallet" />
      </MenuItems>
    </StyledSideMenu>
  );
}
