import React from 'react';
import { TextInput, View, StyleSheet, Clipboard } from 'react-native';
import styled from '@emotion/native';
import {
  TextInput as PaperTextInput,
  Button,
  TouchableRipple,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'emotion-theming';

import Text from 'components/Text';
import TouchableIcon from 'components/TouchableIcon';
import SelectOptions from 'components/SelectOptions';
import QRIcon from 'icons/qr.svg';
import PasteIcon from 'icons/paste.svg';
import SendIcon from 'icons/send.svg';
import ClearIcon from 'icons/x-circle.svg';

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const StyledInput = styled(PaperTextInput)(({ theme }) => ({
  backgroundColor: 'transparent',
}));

const RecipientWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const RecipientInput = styled(TextInput)({
  flex: 1,
});

const AccountSelect = ({ options, value, updateValue }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <View>
      <PaperTextInput
        mode="outlined"
        label="Send from"
        value={options[value]}
        editable={false}
        style={{ marginBottom: 15 }}
        render={({ value, style, ...rest }) => (
          <TouchableRipple
            onPress={() => {
              setOpen(true);
            }}
          >
            <Text
              style={[{ lineHeight: StyleSheet.flatten(style).height }, style]}
              {...rest}
            >
              {value}
            </Text>
          </TouchableRipple>
        )}
      />
      <SelectOptions
        options={options}
        value={value}
        updateValue={updateValue}
        open={open}
        setOpen={setOpen}
      />
    </View>
  );
};

const SendButton = () => {
  const theme = useTheme();
  return (
    <Button
      mode="contained"
      icon={({ size, color }) => (
        <SendIcon style={{ width: size, height: size, color }} />
      )}
      onPress={() => {}}
      contentStyle={{
        color: theme.onPrimary,
      }}
    >
      Send
    </Button>
  );
};

export default function SendScreen() {
  const [account, setAccount] = React.useState('default');
  const [recipient, setRecipient] = React.useState('');
  return (
    <Wrapper>
      <AccountSelect
        options={{ default: 'default', trust: 'trust' }}
        value={account}
        updateValue={setAccount}
      />
      <PaperTextInput
        multiline
        mode="outlined"
        label="Send to"
        placeholder="Recipient address"
        style={{ marginBottom: 15 }}
        value={recipient}
        onChangeText={setRecipient}
        render={(props) => (
          <RecipientWrapper>
            <RecipientInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              {...props}
            />
            {props.value ? (
              <TouchableIcon
                icon={ClearIcon}
                size={15}
                onPress={() => {
                  setRecipient('');
                }}
              />
            ) : (
              <>
                <TouchableIcon
                  icon={PasteIcon}
                  size={15}
                  onPress={async () => {
                    const clipboard = await Clipboard.getString();
                    setRecipient(clipboard);
                  }}
                />
                <TouchableIcon icon={QRIcon} size={15} onPress={() => {}} />
              </>
            )}
          </RecipientWrapper>
        )}
      />
      <StyledInput
        label="Amount (NXS)"
        keyboardType="numeric"
        style={{ marginBottom: 15 }}
      />
      <StyledInput
        label="Reference number (Optional)"
        keyboardType="number-pad"
        style={{ marginBottom: 50 }}
      />
      <SendButton />
    </Wrapper>
  );
}
