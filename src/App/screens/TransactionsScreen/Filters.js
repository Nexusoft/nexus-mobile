import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'lib/theme';
import { TouchableRipple, Button, shadow } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Select from 'components/Select';
import { toggleTransactionsFilter } from 'lib/ui';
import { updateFilter } from 'lib/transactions';
import { fade } from 'utils/color';
import debounced from 'utils/debounced';

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
};

const updateAccountQuery = debounced(
  (accountQuery) => updateFilter({ accountQuery }),
  1000
);
const updateTokenQuery = debounced(
  (tokenQuery) => updateFilter({ tokenQuery }),
  1000
);

function FilterText(props) {
  const theme = useTheme();
  return (
    <Text colorName={theme.dark ? 'foreground' : 'onPrimary'} {...props} />
  );
}

export default function Filters() {
  const { open, operation, timeSpan, accountQuery, tokenQuery } = useSelector(
    (state) => state.ui.transactionsFilter.open
  );
  const theme = useTheme();

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
        value={accountQuery}
        onChangeText={updateAccountQuery}
      />
      <TextBox
        style={styles.filterInput}
        background={theme.dark ? 'background' : 'primary'}
        dense
        label="Token name/address"
        value={tokenQuery}
        onChangeText={updateTokenQuery}
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
