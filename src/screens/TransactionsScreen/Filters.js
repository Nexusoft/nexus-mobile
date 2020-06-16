import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import { TouchableRipple, TextInput, Button, shadow } from 'react-native-paper';

import { View, Text, SubText } from 'components/Typo';
import Select from 'components/Select';
import { getPaperTheme, primaryTheme } from 'lib/theme';
import { toggleTransactionsFilter } from 'lib/ui';
import { fade } from 'utils/color';

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
  { value: 'all', display: 'All' },
  ...operations.map((op) => ({
    value: op,
    display: op,
  })),
];

const timeOptions = [
  {
    value: 'all',
    display: 'All',
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

const FiltersWrapper = styled(View)(({ theme, expanded }) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
  overflow: 'hidden',
  height: expanded ? undefined : 0.1,
  paddingTop: expanded ? 10 : 0,
  paddingBottom: expanded ? 20 : 0,
  paddingHorizontal: 20,
  elevation: 4,
  ...shadow(4),
}));

const FilterSelects = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const FilterSelect = styled.View({
  paddingVertical: 10,
  paddingHorizontal: 12,
  flexDirection: 'row',
});

const FilterLabel = styled(SubText)({
  textTransform: 'uppercase',
  marginRight: 5,
});

const FilterValue = styled(Text)();

const inputStyle = (theme) => ({
  marginVertical: 6,
  fontSize: 15,
  backgroundColor: theme.dark ? undefined : theme.primary,
});

const ApplyButton = styled(Button)({
  marginTop: 15,
});

export default function Filters() {
  const filterOpen = useSelector((state) => state.ui.txFilterOpen);
  const [op, setOp] = React.useState('all');
  const [time, setTime] = React.useState('all');
  const theme = useTheme();
  const paperTheme = theme.dark ? undefined : getPaperTheme(primaryTheme);

  return (
    <FiltersWrapper expanded={filterOpen}>
      <FilterSelects>
        <Select
          options={opOptions}
          value={op}
          updateValue={setOp}
          render={({ value, display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <FilterSelect>
                <FilterLabel>Operation:</FilterLabel>
                <FilterValue>{display}</FilterValue>
              </FilterSelect>
            </TouchableRipple>
          )}
        />
        <Select
          options={timeOptions}
          value={time}
          updateValue={setTime}
          render={({ value, display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <FilterSelect>
                <FilterLabel>Time:</FilterLabel>
                <FilterValue>{display}</FilterValue>
              </FilterSelect>
            </TouchableRipple>
          )}
        />
      </FilterSelects>

      <TextInput
        dense
        label="Account/token name"
        theme={paperTheme}
        style={inputStyle(theme)}
      />
      <TextInput
        dense
        label="Account/token address"
        theme={paperTheme}
        style={inputStyle(theme)}
      />

      <ApplyButton
        mode={theme.dark ? 'outlined' : 'contained'}
        color={theme.dark ? undefined : fade(theme.onPrimary, 0.2)}
        onPress={() => {
          toggleTransactionsFilter();
        }}
        labelStyle={{ fontSize: 12 }}
      >
        Apply filter
      </ApplyButton>
    </FiltersWrapper>
  );
}
