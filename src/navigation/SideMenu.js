import React from "react";
import styled from "@emotion/native";

import { Text } from "components/StyledText";
import NativeButton from "components/NativeButton";
import Component from "components/Component";
import { navigate } from "navigation/container";
import UserIcon from "icons/user.svg";
import TokenIcon from "icons/token.svg";
import NameIcon from "icons/abc.svg";
import NamespaceIcon from "icons/abc-cube.svg";
import AssetIcon from "icons/asset.svg";

const StyledSideMenu = styled.View({
  flex: 1,
  paddingTop: 56,
});

const Divider = styled.View(({ theme }) => ({
  height: 0.33,
  backgroundColor: theme.foreground,
}));

const MenuHeader = styled.View({
  paddingVertical: 10,
  paddingHorizontal: 20,
});

const UserInfo = styled.View({
  flexDirection: "row",
  alignItems: "center",
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
  paddingVertical: 10,
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
});

const MenuItemIcon = styled(Component)(({ theme }) => ({
  color: theme.foregroundEmphasis,
  width: 14,
  height: 14,
  marginRight: 10,
}));

const MenuItem = ({ linkTo, icon, label }) => (
  <NativeButton
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
  </NativeButton>
);

export default function SideMenu(props) {
  return (
    <StyledSideMenu>
      <MenuHeader>
        <UserInfo>
          <UserAvatar />
          <UserName>krysto</UserName>
        </UserInfo>
      </MenuHeader>
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
