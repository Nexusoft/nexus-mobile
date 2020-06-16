import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
import { TouchableRipple, TextInput, Button, shadow } from 'react-native-paper';

import { Surface, Divider, View, Text, SubText } from 'components/Typo';
import { getPaperTheme } from 'lib/theme';
import { toggleTransactionsFilter } from 'lib/ui';
import { fade } from 'utils/color';
import Transaction from './Transaction';
import transactions from './transactions';

const Wrapper = styled(Surface)({
  flex: 1,
  elevation: 0,
});

const Filters = styled(View)(({ theme, expanded }) => ({
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

const Select = styled.View({
  paddingVertical: 10,
  paddingHorizontal: 12,
  flexDirection: 'row',
});

const FilterLabel = styled(SubText)({
  textTransform: 'uppercase',
  marginRight: 10,
});

const FilterValue = styled(Text)();

const inputStyle = (theme) => ({
  marginVertical: 7,
  fontSize: 15,
  backgroundColor: theme.primary,
});

const ApplyButton = styled(Button)({
  marginTop: 15,
});

export default function TransactionsScreen() {
  const filterOpen = useSelector((state) => state.ui.txFilterOpen);
  const theme = useTheme();
  const paperTheme = getPaperTheme({
    ...theme,
    background: theme.primary,
    surface: theme.primary,
    foreground: theme.onPrimary,
    primary: theme.onPrimary,
  });
  return (
    <Wrapper>
      <Filters expanded={filterOpen}>
        <FilterSelects>
          <TouchableRipple onPress={() => {}}>
            <Select>
              <FilterLabel>Operation:</FilterLabel>
              <FilterValue>All</FilterValue>
            </Select>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <Select>
              <FilterLabel>Time:</FilterLabel>
              <FilterValue>All</FilterValue>
            </Select>
          </TouchableRipple>
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
          mode="contained"
          color={fade(theme.onPrimary, 0.2)}
          onPress={() => {
            toggleTransactionsFilter();
          }}
        >
          Apply filter
        </ApplyButton>
      </Filters>

      <FlatList
        data={transactions}
        ItemSeparatorComponent={Divider}
        keyExtractor={(tx) => tx.txid}
        renderItem={({ item }) => <Transaction transaction={item} />}
      />
    </Wrapper>
  );
}
