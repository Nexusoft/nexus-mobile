import React from 'react';
import styled from '@emotion/native';
import {
  TextInput as NativeTextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import { Icon, SubIcon } from 'components/Adaptive';
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

const InputIconWrapper = styled.View(({ mode }) => ({
  paddingTop: mode === 'outlined' ? 8 : 24,
  paddingBottom: mode === 'outlined' ? 8 : 4,
  paddingHorizontal: 8,
}));

export default function TextBox({ mode, secure, clearButton = true, ...rest }) {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  return (
    <PaperTextInput
      mode={mode}
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      secureTextEntry={!visible}
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
              <InputIconWrapper mode={mode}>
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
              <InputIconWrapper mode={mode}>
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
