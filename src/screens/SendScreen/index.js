import React from 'react';
import styled from '@emotion/native';
import { Button, TouchableRipple } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import { TextBox } from 'components/Adaptive';
import SendIcon from 'icons/send.svg';
import AccountSelect from './AccountSelect';
import RecipientInput from './RecipientInput';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const Field = styled.View({
  marginTop: 20,
});

const SendAllButton = styled.Text(({ theme }) => ({
  alignSelf: 'flex-start',
  paddingVertical: 8,
  paddingHorizontal: 12,
  color: theme.primary,
}));

const SendButton = styled(Button)({
  alignSelf: 'flex-end',
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
        <RecipientInput recipient={recipient} setRecipient={setRecipient} />
      </Field>

      <Field>
        <TextBox
          label="Amount (NXS)"
          keyboardType="numeric"
          style={{ marginBottom: 15 }}
        />
        <TouchableRipple onPress={() => {}}>
          <SendAllButton>Send All</SendAllButton>
        </TouchableRipple>
      </Field>

      <Field>
        <TextBox
          label="Reference number (Optional)"
          keyboardType="number-pad"
        />
      </Field>

      <SendButton
        mode="contained"
        icon={({ size, color }) => (
          <SvgIcon icon={SendIcon} {...{ size, color }} />
        )}
        onPress={() => {}}
        contentStyle={{
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}
      >
        Send
      </SendButton>
    </Wrapper>
  );
}
