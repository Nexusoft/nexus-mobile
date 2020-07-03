import React from 'react';
import styled from '@emotion/native';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useField } from 'formik';

import { Text } from 'components/Adaptive';
import TextBox from 'components/TextBox';
import Select from 'components/Select';

const AccountTextBox = styled(TextBox.Adaptive)({
  marginBottom: 15,
});

export default function AccountSelect({ name, options }) {
  const [field, meta, helpers] = useField(name);
  return (
    <Select
      options={options}
      value={field.value}
      updateValue={helpers.setValue}
      render={({ display, openSelect }) => (
        <AccountTextBox
          mode="outlined"
          label="Send from"
          value={display}
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
