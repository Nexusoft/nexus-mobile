import React from 'react';
import styled from '@emotion/native';
import { StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  TouchableRipple,
} from 'react-native-paper';

import { Text } from 'components/Typo';
import SelectOptions from 'components/SelectOptions';

const AccountTextInput = styled(PaperTextInput)({
  marginBottom: 15,
});

export default function AccountSelect({ options, value, updateValue }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <AccountTextInput
        mode="outlined"
        label="Send from"
        value={options[value]}
        editable={false}
        render={({ value, style, ...rest }) => (
          <TouchableRipple
            onPress={() => {
              setOpen(true);
            }}
          >
            <Text
              style={[{ lineHeight: StyleSheet.flatten(style).height }, style]}
              {...rest}
            >
              {value}
            </Text>
          </TouchableRipple>
        )}
      />
      <SelectOptions
        options={options}
        value={value}
        updateValue={updateValue}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
