import React from 'react';
import { View, ScrollView } from 'react-native';
import { RadioButton, Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import TokenName from 'components/TokenName';
import { useTheme } from 'lib/theme';
import { callAPI } from 'lib/api';
import { refreshUserTokens } from 'lib/user';
import { addressRegex } from 'consts/regex';
import memoize from 'utils/memoize';
import { showError } from 'lib/ui';

const styles = {
  inputBox: {
    paddingVertical: 15,
  },
  searchBar: ({ disabled }) =>
    disabled && {
      opacity: 0.5,
      pointerEvents: 'none',
    },
};

const selectTokenOptions = memoize(
  (userTokens, selectedToken) => {
    const options = [null, ...(userTokens || [])];
    const selectedAnotherToken =
      !!selectedToken &&
      !userTokens.some((token) => token.address === selectedToken.address);
    if (selectedAnotherToken) {
      options.unshift(selectedToken);
    }
    return options;
  },
  (state, selectedToken) => [state.user.tokens, selectedToken]
);

async function lookupToken(inputValue) {
  if (addressRegex.test(inputValue)) {
    try {
      return await callAPI('tokens/get/token', { address: inputValue });
    } catch (err) {}
  }
  try {
    return await callAPI('tokens/get/token', { name: inputValue });
  } catch (err) {}
  return null;
}

export default function TokenSelector({
  selectedToken,
  selectToken,
  open,
  onDismiss,
}) {
  React.useEffect(() => {
    refreshUserTokens();
  }, []);
  const theme = useTheme();
  const options = useSelector((state) =>
    selectTokenOptions(state, selectedToken)
  );
  const [searching, setSearching] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const submit = (token) => {
    onDismiss();
    selectToken(token);
    setInputValue('');
  };

  const search = async () => {
    if (!inputValue) return;
    setSearching(true);
    try {
      const token = await lookupToken(inputValue);
      if (token) {
        submit(token);
      } else {
        showError(
          'Invalid token name/address. Be aware that token name is case sensitive'
        );
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={onDismiss} style={{ maxHeight: '80%' }}>
        <Dialog.Title>Select token</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <RadioButton.Group value={selectedToken} onValueChange={submit}>
              {options.map((token) => {
                const selected =
                  (!selectedToken && !token) ||
                  (selectedToken && token?.address === selectedToken.address);
                return (
                  <RadioButton.Item
                    key={token?.address || '0'}
                    value={token}
                    color={theme.primary}
                    uncheckedColor={theme.foreground}
                    label={token ? <TokenName token={token} /> : 'NXS'}
                    labelStyle={{
                      color: selected ? theme.primary : theme.foreground,
                    }}
                    status={selected ? 'checked' : 'unchecked'}
                  />
                );
              })}
            </RadioButton.Group>
          </ScrollView>
          <View style={styles.inputBox}>
            <Searchbar
              disabled={true}
              placeholder="Token name/address"
              value={searching ? 'Searching token...' : inputValue}
              onChangeText={setInputValue}
              style={styles.searchBar({ disabled: searching })}
              editable={!searching}
              onIconPress={search}
              onSubmitEditing={search}
            />
          </View>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
