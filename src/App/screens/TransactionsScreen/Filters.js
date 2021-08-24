import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'lib/theme';
import { TouchableRipple, Button, shadow, List } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Select from 'components/Select';
import SvgIcon from 'components/SvgIcon';
import Divider from 'components/Divider';
import TokenName from 'components/TokenName';
import { toggleTransactionsFilter, showOptions } from 'lib/ui';
import { updateFilter } from 'lib/transactions';
import { refreshUserTokens, refreshUserAccounts } from 'lib/user';
import { disabledColor } from 'lib/theme';
import { fade } from 'utils/color';
import memoize from 'utils/memoize';
import SelectIcon from 'icons/select.svg';

const operations = [
  'APPEND',
  'AUTHORIZE',
  'CLAIM',
  'COINBASE',
  'CREATE',
  'CREDIT',
  'DEBIT',
  'FEE',
  'GENESIS',
  'LEGACY',
  'MIGRATE',
  'TRANSFER',
  'WRITE',
];

const opOptions = [
  {
    value: null,
    display: (
      <Text bold colorName="">
        All
      </Text>
    ),
  },
  ...operations.map((op) => ({
    value: op,
    display: op,
  })),
];

const timeOptions = [
  {
    value: null,
    display: (
      <Text bold colorName="">
        All
      </Text>
    ),
  },
  {
    value: 'year',
    display: 'Past Year',
  },
  {
    value: 'month',
    display: 'Past Month',
  },
  {
    value: 'week',
    display: 'Past Week',
  },
];

const styles = {
  wrapper: ({ theme, expanded }) => ({
    backgroundColor: theme.dark ? theme.background : theme.primary,
    overflow: 'hidden',
    height: expanded ? undefined : 0.1,
    paddingTop: expanded ? 10 : 0,
    paddingBottom: expanded ? 20 : 0,
    paddingHorizontal: 20,
    elevation: 4,
    ...shadow(4),
  }),
  selectLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterSelect: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  filterLabel: {
    textTransform: 'uppercase',
    marginRight: 5,
  },
  filterInput: {
    marginVertical: 6,
    fontSize: 15,
  },
  apply: {
    marginTop: 15,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 12,
  }),
};

const selectAccountOptions = memoize((accounts, contacts) => {
  const accountsMap = {};
  if (accounts) {
    for (const account of accounts) {
      const { address } = account;
      if (address && !accountsMap[address]) {
        accountsMap[address] = {
          type: 'account',
          address,
          account,
        };
      }
    }
  }
  if (contacts) {
    for (const [name, { address }] of Object.keys(contacts)) {
      if (address && !accountsMap[address]) {
        accountsMap[address] = {
          type: 'contact',
          address,
          name,
        };
      }
    }
  }
  return Object.values(accountsMap).map(({ type, address, account, name }) => ({
    value: address,
    display:
      type === 'account' ? (
        <span>
          {account.name || <em>{__('Unnamed account')}</em>}{' '}
          <span className="dim">{address}</span>
        </span>
      ) : (
        <span>
          {name}
          {label ? ' - ' + label : ''} <span className="dim">{address}</span>
        </span>
      ),
  }));
});

const selectKnownTokens = memoize(
  (userTokens, accounts) => {
    userTokens = userTokens || [];
    const tokens = [{ address: '0', name: 'NXS' }, ...userTokens];
    for (const account of accounts || []) {
      if (
        account.token !== '0' &&
        !userTokens.some((token) => token.address === account.token)
      ) {
        tokens.push({
          name: account.ticker || account.token_name,
          address: account.token,
        });
      }
    }
    return tokens;
  },
  (state) => [state.user.tokens, state.user.accounts]
);

function FilterText(props) {
  const theme = useTheme();
  return (
    <Text colorName={theme.dark ? 'foreground' : 'onPrimary'} {...props} />
  );
}

function Option({ label, address }) {
  const theme = useTheme();
  return (
    <View>
      <Text bold>{label}</Text>
      <View style={styles.addressBox({ theme })}>
        <Text style={styles.address} mono>
          {segmentAddress(address)}
        </Text>
      </View>
    </View>
  );
}

export default function Filters() {
  const { open, operation, timeSpan, accountQuery, tokenQuery } = useSelector(
    (state) => state.ui.transactionsFilter
  );
  const [accountInput, setAccountInput] = React.useState(accountQuery);
  const [tokenInput, setTokenInput] = React.useState(tokenQuery);
  // const accountOptions = useSelector(selectAccountOptions);
  const tokens = useSelector(selectKnownTokens);
  const theme = useTheme();
  React.useEffect(() => {
    refreshUserTokens();
    refreshUserAccounts();
  }, []);

  return (
    <View style={styles.wrapper({ theme, expanded: open })}>
      <View style={styles.selectLine}>
        <Select
          options={opOptions}
          value={operation}
          updateValue={(operation) => updateFilter({ operation })}
          render={({ display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <View style={styles.filterSelect}>
                <FilterText style={styles.filterLabel} sub>
                  Operation:
                </FilterText>
                <FilterText>{display}</FilterText>
              </View>
            </TouchableRipple>
          )}
        />
        <Select
          options={timeOptions}
          value={timeSpan}
          updateValue={(timeSpan) => updateFilter({ timeSpan })}
          render={({ display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <View style={styles.filterSelect}>
                <FilterText style={styles.filterLabel} sub>
                  Time:
                </FilterText>
                <FilterText>{display}</FilterText>
              </View>
            </TouchableRipple>
          )}
        />
      </View>

      <TextBox
        style={styles.filterInput}
        background={theme.dark ? 'background' : 'primary'}
        dense
        label="Account name/address"
        value={accountInput}
        onChangeText={setAccountInput}
        onEndEditing={() => {
          updateFilter({ accountQuery: accountInput });
        }}
      />
      <TextBox
        style={styles.filterInput}
        background={theme.dark ? 'background' : 'primary'}
        dense
        label="Token name/address"
        value={tokenInput}
        onChangeText={setTokenInput}
        onEndEditing={() => {
          updateFilter({ tokenQuery: tokenInput });
        }}
        right={
          <TouchableRipple
            onPress={() => {
              showOptions({
                title: 'Select a token',
                options: tokens,
                renderOption: (token) => (
                  <List.Item title={TokenName.from({ token })} />
                ),
                keyExtractor: (token) => token.address,
                ItemSeparatorComponent: Divider,
                onSelect: (token) => {
                  setTokenInput(token.address);
                  updateFilter({ tokenQuery: token.address });
                },
              });
            }}
          >
            <SvgIcon size={12} icon={SelectIcon} />
          </TouchableRipple>
        }
      />

      <Button
        style={styles.apply}
        mode={theme.dark ? 'outlined' : 'contained'}
        color={theme.dark ? undefined : fade(theme.onPrimary, 0.2)}
        onPress={toggleTransactionsFilter}
        labelStyle={{ fontSize: 12 }}
      >
        Apply filter
      </Button>
    </View>
  );
}
