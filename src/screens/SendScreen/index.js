import React from 'react';
import styled from '@emotion/native';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'emotion-theming';

import SvgIcon from 'components/SvgIcon';
import SendIcon from 'icons/send.svg';
import AccountSelect from './AccountSelect';
import RecipientInput from './RecipientInput';

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const StyledInput = styled(PaperTextInput)({
  backgroundColor: 'transparent',
});

const Field = styled.View({
  marginBottom: 15,
});

const SendButton = () => {
  const theme = useTheme();
  return (
    <Button
      mode="contained"
      icon={({ size, color }) => (
        <SvgIcon icon={SendIcon} {...{ size, color }} />
      )}
      onPress={() => {}}
      contentStyle={{
        color: theme.onPrimary,
      }}
      style={{ alignSelf: 'flex-end' }}
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
      <Field>
        <AccountSelect
          options={{ default: 'default', trust: 'trust' }}
          value={account}
          updateValue={setAccount}
        />
      </Field>

      <Field>
        <RecipientInput recipient={recipient} setRecipient={setRecipient} />
      </Field>

      <Field>
        <StyledInput
          label="Amount (NXS)"
          keyboardType="numeric"
          style={{ marginBottom: 15 }}
        />
      </Field>

      <Field>
        <StyledInput
          label="Reference number (Optional)"
          keyboardType="number-pad"
        />
      </Field>
      <SendButton />
    </Wrapper>
  );
}