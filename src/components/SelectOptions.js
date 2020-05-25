import React from 'react';
import { RadioButton, Portal, Dialog } from 'react-native-paper';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'emotion-theming';

const SelectDialog = styled(Dialog)({
  marginVertical: 50,
});

export default function SelectOptions({
  open,
  setOpen,
  value,
  updateValue,
  options,
}) {
  const theme = useTheme();
  return (
    <Portal>
      <SelectDialog
        visible={open}
        onDismiss={() => {
          setOpen(false);
        }}
      >
        <ScrollView>
          <RadioButton.Group
            value={value}
            onValueChange={(value) => {
              updateValue(value);
              setOpen(false);
            }}
          >
            {Object.entries(options).map(([value, display]) => (
              <RadioButton.Item
                key={value}
                value={value}
                color={theme.primary}
                uncheckedColor={theme.foreground}
                label={display}
                labelStyle={{
                  color: theme.foreground,
                }}
              />
            ))}
          </RadioButton.Group>
        </ScrollView>
      </SelectDialog>
    </Portal>
  );
}
