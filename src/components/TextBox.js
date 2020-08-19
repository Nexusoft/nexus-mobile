import React from 'react';
import { View, TextInput, TouchableWithoutFeedback } from 'react-native';
import {
  TextInput as PaperTextInput,
  HelperText,
  overlay,
} from 'react-native-paper';
import { useTheme } from 'lib/theme';
import { useField } from 'formik';

import SvgIcon from 'components/SvgIcon';
import { getPaperTheme } from 'lib/theme';

import VisibleIcon from 'icons/visible.svg';
import InvisibleIcon from 'icons/invisible.svg';
import ClearIcon from 'icons/x-circle.svg';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  icon: ({ mode, dense }) => ({
    paddingTop: mode === 'outlined' || dense ? 8 : 24,
    paddingBottom: mode === 'outlined' || dense ? 8 : 4,
    paddingHorizontal: 8,
  }),
};

function adaptTheme({ theme, backgroundName, elevation }) {
  const bgColor =
    backgroundName === 'surface' && elevation
      ? overlay(elevation, theme[backgroundName])
      : theme[backgroundName];
  switch (backgroundName) {
    case 'surface':
      return { background: bgColor };
    case 'primary':
    case 'primaryVariant':
      return {
        background: bgColor,
        foreground: theme.onPrimary,
        primary: theme.onPrimary,
      };
    case 'danger':
      return {
        background: bgColor,
        foreground: theme.onDanger,
        primary: theme.onDanger,
      };
    default:
      return {};
  }
}

export default function TextBox({
  mode,
  secure,
  dense,
  clearButton = true,
  background,
  style,
  ...rest
}) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [backgroundName, elevation] = Array.isArray(background)
    ? background
    : [background, 4];
  const adaptedTheme = {
    ...theme,
    ...adaptTheme({ theme, backgroundName, elevation }),
  };
  const adaptedPaperTheme = backgroundName
    ? getPaperTheme(adaptedTheme)
    : undefined;
  return (
    <PaperTextInput
      theme={adaptedPaperTheme}
      mode={mode}
      dense={dense}
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      secureTextEntry={!!secure && !visible}
      style={[mode !== 'outlined' && { backgroundColor: 'transparent' }, style]}
      render={({ value, onChangeText, style, ...rest }) => (
        <View style={styles.wrapper}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            style={[style, styles.input]}
            {...rest}
          />
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
              <View style={styles.icon({ mode, dense })}>
                <SvgIcon
                  icon={visible ? VisibleIcon : InvisibleIcon}
                  size={16}
                  color={adaptedTheme.foreground}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
          {!!value && !!clearButton && (
            <TouchableWithoutFeedback
              onPress={() => {
                onChangeText && onChangeText('');
              }}
            >
              <View style={styles.icon({ mode, dense })}>
                <SvgIcon
                  sub
                  icon={ClearIcon}
                  size={16}
                  color={adaptedTheme.foreground}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      )}
      {...rest}
    />
  );
}

function FormikTextBox({ name, onChangeText, ...rest }) {
  const [field, meta, helpers] = useField(name);
  const hasError = !!(meta.touched && meta.error);
  return (
    <>
      <TextBox
        error={hasError}
        value={field.value}
        onChangeText={(...args) => {
          onChangeText && onChangeText(...args);
          helpers.setValue(...args);
        }}
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

TextBox.Formik = FormikTextBox;
