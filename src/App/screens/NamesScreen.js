import React from 'react';
import { View, Clipboard, RefreshControl } from 'react-native';
import { ActivityIndicator, FAB, Surface, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ScreenBody from 'components/ScreenBody';
import Divider from 'components/Divider';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { fetchMyNames, fullName } from 'lib/names';
import { selectUsername } from 'lib/user';
import { navigate } from 'lib/navigation';
import { showError, showNotification } from 'lib/ui';
import useRefresh from 'utils/useRefresh';
import NameIcon from 'icons/abc.svg';

const styles = {
  intro: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  card: { marginHorizontal: 14, marginTop: 8, borderRadius: 12, elevation: 2 },
  row: { paddingHorizontal: 16, paddingVertical: 12 },
  tag: ({ global }) => ({
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: global ? '#dcf5e6' : '#e3eaf2',
  }),
  center: { padding: 30, alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
};

const short = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-5)}` : '';

export default function NamesScreen() {
  const theme = useTheme();
  const username = useSelector(selectUsername);
  const accounts = useSelector((state) => state.user.accounts || []);
  const [names, setNames] = React.useState(null);
  const load = async () => {
    try {
      setNames(await fetchMyNames());
    } catch (err) {
      setNames([]);
      showError(err?.message);
    }
  };
  const [refreshing, refresh] = useRefresh(load);
  //back from a new name
  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const target = (address) => {
    const acc = accounts.find((a) => a.address === address);
    if (!acc) return short(address);
    return `${acc.name || short(acc.address)} (${acc.ticker || 'NXS'})`;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenBody
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Text sub size={13} style={styles.intro}>
          People can send to a name instead of a long address. Local names
          (yourname:name) are cheap; a global name has no prefix and is unique
          on the whole network. Tap a name to copy it.
        </Text>
        {names === null ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : !names.length ? (
          <View style={styles.center}>
            <Text sub>No names yet.</Text>
          </View>
        ) : (
          <Surface style={styles.card}>
            {names.map((n, i) => {
              const text = fullName(n, username);
              return (
                <React.Fragment key={n.address}>
                  {i > 0 && <Divider inset={16} />}
                  <TouchableRipple
                    style={styles.row}
                    onPress={() => {
                      Clipboard.setString(text);
                      showNotification(`Copied ${text}`);
                    }}
                  >
                    <View>
                      <Text bold>{text}</Text>
                      <Text sub size={12}>
                        {`for ${target(n.register)}`}
                      </Text>
                      <View style={styles.tag({ global: n.global })}>
                        <Text size={11} style={{ color: n.global ? '#1b7a47' : '#566175' }}>
                          {n.global ? 'GLOBAL' : 'LOCAL'}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                </React.Fragment>
              );
            })}
          </Surface>
        )}
        <View style={{ height: 90 }} />
      </ScreenBody>
      <FAB
        style={styles.fab}
        icon="plus"
        color={theme.onPrimary}
        label="New name"
        onPress={() => navigate('NewName')}
      />
    </View>
  );
}

NamesScreen.nav = {
  name: 'Names',
  icon: NameIcon,
  options: {
    title: 'Names',
  },
};
