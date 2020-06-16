import React from 'react';
import styled from '@emotion/native';
import {
  TextInput as PaperTextInput,
  Button,
  TouchableRipple,
} from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import { getPaperTheme } from 'lib/theme';
import SendIcon from 'icons/send.svg';
import AccountSelect from './AccountSelect';
import RecipientInput from './RecipientInput';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const StyledInput = styled(PaperTextInput)({
  backgroundColor: 'transparent',
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
  const theme = useTheme();
  const paperTheme = getPaperTheme({ ...theme, background: theme.surface });
  return (
    <Wrapper surface>
      <Field>
        <AccountSelect
          options={['default', 'trust']}
          value={account}
          updateValue={setAccount}
          customTheme={paperTheme}
        />
      </Field>

      <Field>
        <RecipientInput
          recipient={recipient}
          setRecipient={setRecipient}
          customTheme={paperTheme}
        />
      </Field>

      <Field>
        <StyledInput
          label="Amount (NXS)"
          keyboardType="numeric"
          style={{ marginBottom: 15 }}
        />
        <TouchableRipple onPress={() => {}}>
          <SendAllButton>Send All</SendAllButton>
        </TouchableRipple>
      </Field>

      <Field>
        <StyledInput
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
