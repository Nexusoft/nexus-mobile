import React from 'react';
import { LayoutAnimation } from 'react-native';
import styled from '@emotion/native';
import { IconButton, TouchableRipple, shadow } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import {
  View,
  ScrollView,
  Text,
  SubText,
  Icon,
  Divider,
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
  backgroundColor: theme.primary,
}));

const TopArea = styled.View({
  height: 56,
  flexDirection: 'row',
  alignItems: 'center',
});

const UserArea = styled.View({
  paddingTop: 30,
  paddingBottom: 40,
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

const UserID = styled(SubText)({
  fontFamily: 'robotomono',
  fontSize: 12,
});

const MenuItems = styled.View({
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

const UserActions = styled(ScrollView)(({ theme, expanded }) => ({
  backgroundColor: theme.primary,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: expanded ? 0 : '100%',
  elevation: expanded ? 4 : 0,
  ...shadow(expanded ? 4 : 0),
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
      {!!icon && <MenuItemIcon icon={icon} size={14} />}
      <Text emphasis>{label}</Text>
    </MenuItemWrapper>
  </TouchableRipple>
);

export default function SideMenu({ navigation }) {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  return (
    <StyledSideMenu>
      <TouchableRipple
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setExpanded(!expanded);
        }}
      >
        <MenuHeader>
          <TopArea>
            <IconButton
              icon="arrow-left"
              color={theme.onPrimary}
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
      </TouchableRipple>

      <MenuItems>
        <ScrollView>
          <MenuItem
            linkTo="Transactions"
            icon={TransactionIcon}
            label="Transactions"
          />
          <MenuItem linkTo="Tokens" icon={TokenIcon} label="Tokens" />
          <MenuItem linkTo="Names" icon={NameIcon} label="Names" />
          <MenuItem
            linkTo="Namespaces"
            icon={NamespaceIcon}
            label="Namespaces"
          />
          <MenuItem linkTo="Assets" icon={AssetIcon} label="Assets" />
          <Divider inset={20} spacing={5} />

          <MenuItem label="About Nexus Wallet" />
        </ScrollView>

        <UserActions expanded={expanded}>
          <Divider inset={20} spacing={5} />
          <UserID>
            a1dbd4c955b60dcf74e372aed71b814d9de043e94faf9a29216c582b67f69907
          </UserID>
          <MenuItem label="Change password & PIN" />
          <Divider inset={20} spacing={5} />
          <MenuItem label="Change recovery phrase" />
          <MenuItem label="Log out" />
        </UserActions>
      </MenuItems>
    </StyledSideMenu>
  );
}
