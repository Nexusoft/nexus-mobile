import React from "react";
import styled from "@emotion/native";

import { Text } from "components/StyledText";
import NativeButton from "components/NativeButton";
import { navigate } from "navigation/container";

const StyledSideMenu = styled.View(({ theme }) => ({
  flex: 1,
  paddingTop: 56,
}));

const Divider = styled.View(({ theme }) => ({
  height: 0.33,
  backgroundColor: theme.foreground,
}));

const MenuHeader = styled.View({
  paddingVertical: 10,
  paddingHorizontal: 20,
});

const UserInfo = styled.View({});

const UserName = styled(Text)(({ theme }) => ({
  color: theme.primary,
  fontSize: 24,
}));

const MenuItem = styled.View(({ theme }) => ({
  paddingVertical: 10,
  paddingHorizontal: 20,
  color: theme.foreground,
}));

export default function SideMenu(props) {
  return (
    <StyledSideMenu>
      <MenuHeader>
        <UserInfo>
          <UserName>krysto</UserName>
        </UserInfo>
      </MenuHeader>
      <Divider />

      <NativeButton
        borderless={false}
        onPress={() => {
          navigate("Tokens");
        }}
      >
        <MenuItem>
          <Text emphasis>Tokens</Text>
        </MenuItem>
      </NativeButton>
      <NativeButton
        borderless={false}
        onPress={() => {
          navigate("Names");
        }}
      >
        <MenuItem>
          <Text emphasis>Names</Text>
        </MenuItem>
      </NativeButton>
      <NativeButton
        borderless={false}
        onPress={() => {
          navigate("Namespaces");
        }}
      >
        <MenuItem>
          <Text emphasis>Namespaces</Text>
        </MenuItem>
      </NativeButton>
      <NativeButton
        borderless={false}
        onPress={() => {
          navigate("Assets");
        }}
      >
        <MenuItem>
          <Text emphasis>Assets</Text>
        </MenuItem>
      </NativeButton>
      <Divider />

      <NativeButton borderless={false}>
        <MenuItem>
          <Text emphasis>Change password & PIN</Text>
        </MenuItem>
      </NativeButton>
      <NativeButton borderless={false}>
        <MenuItem>
          <Text emphasis>Change recovery phrase</Text>
        </MenuItem>
      </NativeButton>
      <NativeButton borderless={false}>
        <MenuItem>
          <Text emphasis>Log out</Text>
        </MenuItem>
      </NativeButton>
      <Divider />

      <NativeButton borderless={false}>
        <MenuItem>
          <Text emphasis>About Nexus Wallet</Text>
        </MenuItem>
      </NativeButton>
    </StyledSideMenu>
  );
}
