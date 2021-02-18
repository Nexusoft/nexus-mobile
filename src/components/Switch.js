import React from 'react';
import { Switch as PaperSwitch } from 'react-native-paper';
import { useField } from 'formik';

import { useTheme } from 'lib/theme';

export default function Switch(props) {
  const theme = useTheme();
  return <PaperSwitch color={theme.primary} {...props} />;
}

function FormikSwitch({ name, onValueChange, ...rest }) {
  const [field, meta, helpers] = useField(name);
  return (
    <>
      <Switch
        value={field.value}
        onValueChange={(value) => {
          onValueChange && onValueChange(value);
          helpers.setValue(value);
        }}
        {...rest}
      />
    </>
  );
}

Switch.Formik = FormikSwitch;
