import React from 'react';
import styled from '@emotion/native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import {
  View,
  ScrollView,
  Text,
  Icon,
  Divider,
  ForegroundComponentFactory,
} from 'components/Typo';
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

const MenuHeader = styled(View)(({ theme }) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
}));

const TopArea = styled.View({
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
});

const BackButton = ForegroundComponentFactory(IconButton, null, true);

const UserArea = styled.View({
  paddingTop: 30,
  paddingBottom: 50,
  paddingHorizontal: 20,
});

const UserInfo = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const UserAvatar = styled(Icon)({
  marginRight: 15,
});

const UserName = styled(Text)({
  fontSize: 24,
});

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

const MenuItemIcon = styled(Icon)({
  marginRight: 10,
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
      {!!icon && <MenuItemIcon icon={icon} size={14} />}
      <Text emphasis>{label}</Text>
    </MenuItemWrapper>
  </TouchableRipple>
);

export default function SideMenu({ navigation }) {
  return (
    <StyledSideMenu>
      <MenuHeader>
        <TopArea>
          <BackButton
            icon="arrow-left"
            size={25}
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
        <MenuItem
          linkTo="Transactions"
          icon={TransactionIcon}
          label="Transactions"
        />
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
