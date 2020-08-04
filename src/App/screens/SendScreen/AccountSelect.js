import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useField } from 'formik';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Select from 'components/Select';

export default function AccountSelect({ name, options }) {
  const [field, meta, helpers] = useField(name);
  return (
    <Select
      options={options}
      value={field.value}
      updateValue={helpers.setValue}
      render={({ display, openSelect }) => (
        <TextBox
          style={{ marginBottom: 15 }}
          background={['surface', 0]}
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
