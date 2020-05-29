import React from 'react';
import styled from '@emotion/native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import Text from 'components/Text';
import Component from 'components/Component';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import UserIcon from 'icons/user.svg';
import TransactionIcon from 'icons/transaction.svg';
import TokenIcon from 'icons/token.svg';
import NameIcon from 'icons/abc.svg';
import NamespaceIcon from 'icons/abc-cube.svg';
import AssetIcon from 'icons/asset.svg';

const StyledSideMenu = styled.View({
  flex: 1,
});

const MenuHeader = styled.View(({ theme }) => ({
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.primary,
}));

const UserArea = styled.View(({ theme }) => ({
  paddingTop: 30,
  paddingBottom: 40,
  paddingHorizontal: 20,
  backgroundColor: theme.primary,
}));

const UserInfo = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const UserAvatar = styled(UserIcon)(({ theme }) => ({
  color: theme.onPrimary,
  width: 25,
  height: 25,
  marginRight: 15,
}));

const UserName = styled(Text)(({ theme }) => ({
  color: theme.onPrimary,
  fontSize: 24,
}));

const MenuItemWrapper = styled.View({
  paddingVertical: 15,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center',
});

const MenuItemIcon = styled(Component)(({ theme }) => ({
  color: theme.foreground,
  width: 14,
  height: 14,
  marginRight: 10,
}));

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
      {!!icon && <MenuItemIcon as={icon} />}
      <Text emphasis>{label}</Text>
    </MenuItemWrapper>
  </TouchableRipple>
);

export default function SideMenu({ navigation }) {
  const theme = useTheme();
  return (
    <StyledSideMenu>
      <MenuHeader>
        <IconButton
          icon="arrow-left"
          color={theme.onPrimary}
          size={25}
          onPress={() => {
            navigation.closeDrawer();
          }}
        />
      </MenuHeader>

      <UserArea>
        <UserInfo>
          <UserAvatar />
          <UserName>krysto</UserName>
        </UserInfo>
      </UserArea>
      <Divider />

      <MenuItem
        linkTo="Transactions"
        icon={TransactionIcon}
        label="Transactions"
      />
      <MenuItem linkTo="Tokens" icon={TokenIcon} label="Tokens" />
      <MenuItem linkTo="Names" icon={NameIcon} label="Names" />
      <MenuItem linkTo="Namespaces" icon={NamespaceIcon} label="Namespaces" />
      <MenuItem linkTo="Assets" icon={AssetIcon} label="Assets" />
      <Divider />

      <MenuItem label="Change password & PIN" />
      <MenuItem label="Change recovery phrase" />
      <MenuItem label="Log out" />
      <Divider />

      <MenuItem label="About Nexus Wallet" />
    </StyledSideMenu>
  );
}
