import React from 'react';
import {
  View,
  Platform,
  LayoutAnimation,
  StyleSheet,
  Clipboard,
} from 'react-native';
import {
  IconButton,
  TouchableRipple,
  Dialog,
  Button,
} from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Portal from 'components/Portal';
import { useTheme, subColor } from 'lib/theme';
import { logout } from 'lib/user';
import { confirm, showNotification } from 'lib/ui';
// import { addNavListener } from 'lib/navigation';
import UserIcon from 'icons/user.svg';
import IDIcon from 'icons/id.svg';
import KeyIcon from 'icons/key.svg';
import RecoveryIcon from 'icons/recovery.svg';
import LogoutIcon from 'icons/logout.svg';
import CopyIcon from 'icons/copy.svg';
import MenuItem from './MenuItem';

const styles = {
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
    minHeight: 108,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  userNameLine: ({ expanded }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  }),
  userAvatarName: {
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
  expandIcon: ({ theme }) => ({
    fontSize: 18,
    color: subColor(theme.dark ? theme.foreground : theme.onPrimary),
  }),
  userActions: ({ expanded }) => ({
    // setting height to 0 makes text have the stretch effect
    // setting height to > 0 makes text have the revealing effect (on Android)
    height: expanded ? undefined : 0.01,
    overflow: 'hidden',
  }),
  userID: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
};

function UserIdDialog({ visible, onDismiss }) {
  const username = useSelector((state) => state.user.status?.username);
  const userID = useSelector((state) => state.user.status?.genesis);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>User ID</Dialog.Title>
        <Dialog.Content>
          <TextBox
            multiline
            dense
            background={['surface', 0]}
            mode="outlined"
            label={username}
            value={userID}
            editable={false}
            render={({ style, ...rest }) => (
              <Text
                style={[
                  style,
                  {
                    lineHeight: StyleSheet.flatten(style).height,
                    fontFamily: 'robotomono',
                    fontSize: 15,
                  },
                ]}
                {...rest}
              >
                {userID}
              </Text>
            )}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="text"
            icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
            onPress={() => {
              Clipboard.setString(userID);
              showNotification('Copied to clipboard');
            }}
          >
            Copy
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

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

export default function SideBarHeader({ navigation }) {
  const theme = useTheme();
  const colorName = theme.dark ? 'foreground' : 'onPrimary';
  const [expanded, setExpanded] = React.useState(false);
  const username = useSelector((state) => state.user.status?.username);
  const hasRecoveryPhrase = useSelector(
    (state) => !!state.user?.status?.recovery
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // React.useEffect(() => {
  //   console.log('add listener');
  //   const unsubscribe = addNavListener('drawerClose', () => {
  //     console.log(close);
  //     setExpanded(false);
  //   });
  //   return () => {
  //     unsubscribe();
  //     console.log('unsub');
  //   };
  // }, [navigation]);

  return (
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

      <TouchableRipple
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setExpanded(!expanded);
        }}
      >
        <View style={styles.userArea}>
          <View style={styles.userNameLine({ expanded })}>
            <View style={styles.userAvatarName}>
              <SvgIcon
                style={styles.avatar({ theme })}
                icon={UserIcon}
                size={25}
              />
              <Text style={styles.userName({ theme })}>{username}</Text>
            </View>
            <Ionicons
              style={styles.expandIcon({ theme })}
              name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
            />
          </View>

          <View style={styles.userActions({ expanded })}>
            <MenuItem
              small
              padded
              colorName={colorName}
              icon={IDIcon}
              label="Show user ID"
              action={() => {
                navigation.closeDrawer();
                setDialogOpen(true);
              }}
            />
            <MenuItem
              small
              padded
              colorName={colorName}
              icon={KeyIcon}
              label="Change password & PIN"
              linkTo="ChangePassword"
            />
            <MenuItem
              small
              padded
              colorName={colorName}
              icon={RecoveryIcon}
              label={
                hasRecoveryPhrase
                  ? 'Change recovery phrase'
                  : 'Set recovery phrase'
              }
              linkTo="SetRecovery"
            />
            <MenuItem
              small
              padded
              colorName={colorName}
              icon={LogoutIcon}
              label="Log out"
              action={() => {
                confirmLogout({ closeDrawer: navigation.closeDrawer });
              }}
            />
          </View>
        </View>
      </TouchableRipple>

      <UserIdDialog
        visible={dialogOpen}
        onDismiss={() => {
          setDialogOpen(false);
        }}
      />
    </View>
  );
}