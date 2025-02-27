import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'lib/theme';
import { TouchableRipple, Button, shadow, List } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Select from 'components/Select';
import TokenName from 'components/TokenName';
import SvgIcon from 'components/SvgIcon';
import { toggleTransactionsFilter, showOptions } from 'lib/ui';
import { updateFilter, loadTransactions } from 'lib/transactions';
import { refreshUserTokens, refreshUserAccounts } from 'lib/user';
import { disabledColor } from 'lib/theme';
import { fade } from 'utils/color';
import memoize from 'utils/memoize';
import SearchIcon from 'icons/search.svg';
import DownArrowIcon from 'icons/chevron-down.svg';

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
  'TRUST',
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

const selectKnownTokens = memoize((userTokens, accounts) => {
  userTokens = userTokens || [];
  const tokens = [{ address: '0', name: 'NXS' }, ...userTokens];
  for (const account of accounts || []) {
    const tokenAddress = account.token;
    if (
      tokenAddress !== '0' &&
      !userTokens.some((token) => token.address === tokenAddress)
    ) {
      tokens.push({
        name: account.ticker || account.token_name,
        address: tokenAddress,
      });
    }
  }
  return tokens;
});

const selectContactList = memoize(
  (contacts) =>
    contacts &&
    Object.entries(contacts).map(([name, { address }]) => ({ name, address }))
);

const selectSearchOptions = memoize(
  (accounts, userTokens, contacts) => {
    const sections = [];

    if (accounts) {
      sections.push({
        key: 'Accounts',
        data: accounts,
      });
    }

    sections.push({
      key: 'Tokens',
      data: selectKnownTokens(userTokens, accounts),
    });

    const contactList = selectContactList(contacts);
    if (contactList?.length) {
      sections.push({
        key: 'Contacts',
        data: contactList,
      });
    }

    return sections;
  },
  ({ contacts, user: { tokens, accounts } }) => [accounts, tokens, contacts]
);

function FilterText(props) {
  const theme = useTheme();
  return (
    <Text colorName={theme.dark ? 'foreground' : 'onPrimary'} {...props} />
  );
}

export default function Filters() {
  const theme = useTheme();
  const { open, operation, timeSpan, addressQuery } = useSelector(
    (state) => state.ui.transactionsFilter
  );
  const searchOptions = useSelector(selectSearchOptions);
  const [searchInput, setSearchInput] = React.useState(addressQuery);
  React.useEffect(() => {
    refreshUserTokens();
    refreshUserAccounts();
  }, []);

  const showSearchOptions = () =>
    showOptions({
      sectioned: true,
      options: searchOptions,
      renderOption: (option, { section }) => {
        switch (section.key) {
          case 'Accounts':
            return (
              <List.Item
                title={option.name || <Text disabled>Unnamed account</Text>}
              />
            );
          case 'Tokens':
            return <List.Item title={<TokenName token={option} verbose />} />;
          case 'Contacts':
            return <List.Item title={option.name} />;
        }
      },
      keyExtractor: (option) => option.address,
      onSelect: (option) => {
        setSearchInput(option.address);
        updateFilter({ addressQuery: option.address });
      },
    });

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
        label="Search for account/token address"
        value={searchInput}
        onChangeText={setSearchInput}
        onEndEditing={() => {
          updateFilter({ addressQuery: searchInput });
        }}
        leftIcon={({ color }) => (
          <SvgIcon sub icon={SearchIcon} size={14} color={color} />
        )}
        rightButton={{
          onPress: showSearchOptions,
          icon: DownArrowIcon,
          iconSize: 12,
        }}
      />

      <Button
        style={styles.apply}
        mode={theme.dark ? 'outlined' : 'contained'}
        color={theme.dark ? undefined : fade(theme.onPrimary, 0.2)}
        onPress={() => {
          loadTransactions({ reload: true });
          toggleTransactionsFilter();
        }}
        labelStyle={{ fontSize: 12 }}
      >
        Apply filter
      </Button>
    </View>
  );
}
