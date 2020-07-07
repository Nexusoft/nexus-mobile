import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import { TouchableRipple, Button, shadow } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Select from 'components/Select';
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
  {
    value: 'all',
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
    value: 'all',
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

const FilterText = styled(Text)(({ theme }) => ({
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const FilterLabel = styled(FilterText)({
  textTransform: 'uppercase',
  marginRight: 5,
});

const FilterValue = styled(FilterText)();

const FilterInput = styled(TextBox)({
  marginVertical: 6,
  fontSize: 15,
});

const ApplyButton = styled(Button)({
  marginTop: 15,
});

export default function Filters() {
  const filterOpen = useSelector((state) => state.ui.txFilterOpen);
  const [op, setOp] = React.useState('all');
  const [time, setTime] = React.useState('all');
  const theme = useTheme();

  return (
    <FiltersWrapper expanded={filterOpen}>
      <FilterSelects>
        <Select
          options={opOptions}
          value={op}
          updateValue={setOp}
          render={({ display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <FilterSelect>
                <FilterLabel sub>Operation:</FilterLabel>
                <FilterValue>{display}</FilterValue>
              </FilterSelect>
            </TouchableRipple>
          )}
        />
        <Select
          options={timeOptions}
          value={time}
          updateValue={setTime}
          render={({ display, openSelect }) => (
            <TouchableRipple onPress={openSelect}>
              <FilterSelect>
                <FilterLabel sub>Time:</FilterLabel>
                <FilterValue>{display}</FilterValue>
              </FilterSelect>
            </TouchableRipple>
          )}
        />
      </FilterSelects>

      <FilterInput
        background={theme.dark ? 'background' : 'primary'}
        dense
        label="Account/token name"
      />
      <FilterInput
        background={theme.dark ? 'background' : 'primary'}
        dense
        label="Account/token address"
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
