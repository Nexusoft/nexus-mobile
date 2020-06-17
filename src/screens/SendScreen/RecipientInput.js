import React from 'react';
import { TextInput, Clipboard } from 'react-native';
import styled from '@emotion/native';
import {
  TextInput as PaperTextInput,
  IconButton,
  Button,
} from 'react-native-paper';

import { Icon, SubIcon } from 'components/Typo';
import QRIcon from 'icons/qr.svg';
import PasteIcon from 'icons/paste.svg';
import ClearIcon from 'icons/x-circle.svg';

const RecipientWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
});

const RecipientTextInput = styled(TextInput)({
  flex: 1,
});

const InputIconButton = styled(IconButton)({
  margin: 0,
  width: 36,
  height: 36,
  borderRadius: 18,
});

export default function RecipientInput({
  recipient,
  setRecipient,
  paperTheme,
}) {
  return (
    <PaperTextInput
      theme={paperTheme}
      multiline
      mode="outlined"
      label="Send to"
      placeholder="Recipient address"
      value={recipient}
      onChangeText={setRecipient}
      render={(props) => (
        <RecipientWrapper>
          <RecipientTextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            {...props}
          />
          {props.value ? (
            <InputIconButton
              icon={({ size }) => <SubIcon icon={ClearIcon} size={size} />}
              size={16}
              onPress={() => {
                setRecipient('');
              }}
            />
          ) : (
            <>
              <InputIconButton
                icon={({ size }) => <Icon icon={PasteIcon} size={size} />}
                size={16}
                onPress={async () => {
                  const clipboard = await Clipboard.getString();
                  setRecipient(clipboard);
                }}
              />
              <InputIconButton
                style={{ marginRight: 5 }}
                icon={({ size }) => <Icon icon={QRIcon} size={size} />}
                size={16}
                onPress={() => {}}
              />
            </>
          )}
        </RecipientWrapper>
      )}
    />
  );
}
