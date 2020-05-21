import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
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

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingVertical: 20,
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
        color: theme.primaryAccent,
      }}
    >
      Send
    </Button>
  );
};

export default function SendScreen() {
  const [account, setAccount] = React.useState('default');
  return (
    <Wrapper>
      <AccountSelect
        options={{ default: 'default', trust: 'trust' }}
        value={account}
        updateValue={setAccount}
      />
      <PaperTextInput
        mode="outlined"
        label="Send to"
        placeholder="Recipient address"
        style={{ marginBottom: 15 }}
        render={(props) => (
          <RecipientWrapper>
            <RecipientInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              {...props}
            />
            {!props.value && (
              <>
                <TouchableIcon icon={PasteIcon} size={15} onPress={() => {}} />
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
