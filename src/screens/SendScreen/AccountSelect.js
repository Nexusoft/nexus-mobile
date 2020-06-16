import React from 'react';
import styled from '@emotion/native';
import { StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  TouchableRipple,
} from 'react-native-paper';

import { Text } from 'components/Typo';
import Select from 'components/Select';

const AccountTextInput = styled(PaperTextInput)({
  marginBottom: 15,
});

export default function AccountSelect({
  options,
  value,
  updateValue,
  customTheme,
}) {
  return (
    <Select
      options={options}
      value={value}
      updateValue={updateValue}
      render={({ value, openSelect }) => (
        <PaperTextInput
          style={{ marginBottom: 15 }}
          theme={customTheme}
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
