import React from 'react';
import styled from '@emotion/native';
import { Button, TouchableRipple } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import TextBox from 'components/TextBox';
import AddressPicker from 'components/AddressPicker';
import { navigate } from 'lib/navigation';
import AccountSelect from './AccountSelect';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const Field = styled.View({
  marginTop: 20,
});

const SendAllButton = styled.Text(({ theme }) => ({
  alignSelf: 'flex-end',
  paddingVertical: 8,
  paddingHorizontal: 12,
  color: theme.primary,
}));

const SendButton = styled(Button)({
  marginTop: 50,
});

export default function SendScreen({ route }) {
  const [account, setAccount] = React.useState(
    route.params?.accountName || 'default'
  );
  const [recipient, setRecipient] = React.useState('');
  return (
    <Wrapper surface>
      <Field>
        <AccountSelect
          options={['default', 'trust']}
          value={account}
          updateValue={setAccount}
        />
      </Field>

      <Field>
        <TextBox.Adaptive
          multiline
          label="Send to"
          placeholder="Recipient address"
          value={recipient}
          onChangeText={setRecipient}
        />
        <AddressPicker setAddress={setRecipient} />
      </Field>

      <Field>
        <TextBox.Adaptive
          label="Amount (NXS)"
          keyboardType="numeric"
          style={{ marginBottom: 15 }}
        />
        <TouchableRipple onPress={() => {}}>
          <SendAllButton>Send All</SendAllButton>
        </TouchableRipple>
      </Field>

      <Field>
        <TextBox.Adaptive
          label="Reference number (Optional)"
          keyboardType="number-pad"
        />
      </Field>

      <SendButton
        mode="contained"
        onPress={() => {
          navigate('ConfirmSend');
        }}
      >
        Send
      </SendButton>
    </Wrapper>
  );
}

SendScreen.nav = {
  name: 'Send',
};
