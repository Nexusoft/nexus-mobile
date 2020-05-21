import React from 'react';
import { Platform } from 'react-native';
import styled from '@emotion/native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import { Text } from 'components/StyledText';
import Component from 'components/Component';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import UserIcon from 'icons/user.svg';
import TokenIcon from 'icons/token.svg';
import NameIcon from 'icons/abc.svg';
import NamespaceIcon from 'icons/abc-cube.svg';
import AssetIcon from 'icons/asset.svg';

const StyledSideMenu = styled.View({
  flex: 1,
});

const MenuHeader = styled.View({
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
});

const UserArea = styled.View({
  paddingVertical: 20,
  paddingHorizontal: 20,
});

const UserInfo = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const UserAvatar = styled(UserIcon)(({ theme }) => ({
  color: theme.primary,
  width: 25,
  height: 25,
  marginRight: 15,
}));

const UserName = styled(Text)(({ theme }) => ({
  color: theme.primary,
  fontSize: 24,
}));

const MenuItemWrapper = styled.View({
  paddingVertical: 15,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center',
});

const MenuItemIcon = styled(Component)(({ theme }) => ({
  color: theme.foregroundEmphasis,
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
        {Platform.OS !== 'ios' && (
          <IconButton
            icon="arrow-left"
            color={theme.foregroundEmphasis}
            size={25}
            onPress={() => {
              navigation.closeDrawer();
            }}
          />
        )}
      </MenuHeader>

      <UserArea>
        <UserInfo>
          <UserAvatar />
          <UserName>krysto</UserName>
        </UserInfo>
      </UserArea>
      <Divider />

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
