import React from 'react';
import styled from '@emotion/native';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { Text, PaperTextInput } from 'components/Adaptive';
import Select from 'components/Select';

const AccountTextInput = styled(PaperTextInput)({
  marginBottom: 15,
});

export default function AccountSelect({ options, value, updateValue }) {
  return (
    <Select
      options={options}
      value={value}
      updateValue={updateValue}
      render={({ value, openSelect }) => (
        <AccountTextInput
          mode="outlined"
          label="Send from"
          value={options[value]}
          editable={false}
          render={({ value, style, ...rest }) => (
            <TouchableRipple onPress={openSelect}>
              <Text
                style={[
                  { lineHeight: StyleSheet.flatten(style).height },
                  style,
                ]}
                {...rest}
              >
                {value}
              </Text>
            </TouchableRipple>
          )}
        />
      )}
    />
  );
}
