import React from 'react';
import { TextInput, Clipboard } from 'react-native';
import styled from '@emotion/native';
import {
  TextInput as PaperTextInput,
  IconButton,
  Button,
} from 'react-native-paper';

import { Icon } from 'components/Typo';
import QRIcon from 'icons/qr.svg';
import PasteIcon from 'icons/paste.svg';
import ClearIcon from 'icons/x-circle.svg';

const RecipientWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const RecipientTextInput = styled(TextInput)({
  flex: 1,
});

export default function RecipientInput({ recipient, setRecipient }) {
  return (
    <PaperTextInput
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
            <IconButton
              icon={({ size }) => <Icon icon={ClearIcon} size={size} />}
              size={15}
              onPress={() => {
                setRecipient('');
              }}
            />
          ) : (
            <>
              <IconButton
                icon={({ size }) => <Icon icon={PasteIcon} size={size} />}
                size={15}
                onPress={async () => {
                  const clipboard = await Clipboard.getString();
                  setRecipient(clipboard);
                }}
              />
              <IconButton
                icon={({ size }) => <Icon icon={QRIcon} size={size} />}
                size={15}
                onPress={() => {}}
              />
            </>
          )}
        </RecipientWrapper>
      )}
    />
  );
}
