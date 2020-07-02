import React from 'react';
import styled from '@emotion/native';
import {
  TextInput as NativeTextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { useTheme } from 'emotion-theming';
import { useField } from 'formik';

import { Icon, SubIcon } from 'components/Adaptive';
import { useAdaptedPaperTheme } from 'lib/adaptive';

import VisibleIcon from 'icons/visible.svg';
import InvisibleIcon from 'icons/invisible.svg';
import ClearIcon from 'icons/x-circle.svg';

const InputWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
});

const TextInput = styled(NativeTextInput)({
  flex: 1,
});

const InputIconWrapper = styled.View(({ mode, dense }) => ({
  paddingTop: mode === 'outlined' || dense ? 8 : 24,
  paddingBottom: mode === 'outlined' || dense ? 8 : 4,
  paddingHorizontal: 8,
}));

export default function TextBox({
  mode,
  secure,
  dense,
  clearButton = true,
  ...rest
}) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  return (
    <PaperTextInput
      mode={mode}
      dense={dense}
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      secureTextEntry={!!secure && !visible}
      render={({ value, onChangeText, ...rest }) => (
        <InputWrapper>
          <TextInput value={value} onChangeText={onChangeText} {...rest} />
          {!!value && !!secure && (
            <TouchableWithoutFeedback
              delayPressIn={0}
              delayPressOut={0}
              onPressIn={() => {
                setVisible(true);
              }}
              onPressOut={() => {
                setVisible(false);
              }}
            >
              <InputIconWrapper mode={mode} dense={dense}>
                <Icon icon={visible ? VisibleIcon : InvisibleIcon} size={16} />
              </InputIconWrapper>
            </TouchableWithoutFeedback>
          )}
          {!!value && !!clearButton && (
            <TouchableWithoutFeedback
              onPress={() => {
                onChangeText && onChangeText('');
              }}
            >
              <InputIconWrapper mode={mode} dense={dense}>
                <SubIcon icon={ClearIcon} size={16} />
              </InputIconWrapper>
            </TouchableWithoutFeedback>
          )}
        </InputWrapper>
      )}
      {...rest}
    />
  );
}

function AdaptiveTextBox({ mode, style, ...rest }) {
  const adaptedPaperTheme = useAdaptedPaperTheme();
  return (
    <TextBox
      mode={mode}
      theme={adaptedPaperTheme}
      style={[mode !== 'outlined' && { backgroundColor: 'transparent' }, style]}
      {...rest}
    />
  );
}

function FormikTextBox({ name, ...rest }) {
  const [field, meta, helpers] = useField(name);
  const hasError = !!(meta.touched && meta.error);
  return (
    <>
      <AdaptiveTextBox
        error={hasError}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => {
          helpers.setTouched(true);
        }}
        {...rest}
      />
      <HelperText type="error" visible={hasError}>
        {meta.error}
      </HelperText>
    </>
  );
}

TextBox.Adaptive = AdaptiveTextBox;
TextBox.Formik = FormikTextBox;
