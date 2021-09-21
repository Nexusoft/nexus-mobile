import React from 'react';
import { ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import memoize from 'utils/memoize';

// Converts different kinds of options into an array of `{value, display}` objects
const normalizeOptions = memoize((options) => {
  if (Array.isArray(options)) {
    return options.map((option) => ({
      value: option && (typeof option === 'object' ? option.value : option),
      display: option && (typeof option === 'object' ? option.display : option),
    }));
  } else if (typeof options === 'object') {
    return Object.entries(options).map(([value, display]) => ({
      value,
      display,
    }));
  }
  return options;
});

function SelectOptions({ open, setOpen, value, updateValue, options }) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={() => {
          setOpen(false);
        }}
      >
        <Dialog.Content>
          <ScrollView>
            <RadioButton.Group
              value={value}
              onValueChange={(value) => {
                updateValue(value);
                setOpen(false);
              }}
            >
              {normalizeOptions(options).map(
                ({ value: optionVal, display }, i) => (
                  <RadioButton.Item
                    key={i}
                    value={optionVal}
                    color={theme.primary}
                    uncheckedColor={theme.foreground}
                    label={display}
                    labelStyle={{
                      color:
                        optionVal === value ? theme.primary : theme.foreground,
                    }}
                    status={optionVal === value ? 'checked' : 'unchecked'}
                  />
                )
              )}
            </RadioButton.Group>
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

export default function Select({ options, value, updateValue, render }) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = normalizeOptions(options).find(
    (o) => o.value === value
  );
  return (
    <>
      {render({
        value,
        display: selectedOption && selectedOption.display,
        openSelect: () => {
          setOpen(true);
        },
      })}
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
