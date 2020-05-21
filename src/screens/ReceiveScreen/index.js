import React from 'react';
import { LayoutAnimation } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from '@emotion/native';

import Account from './Account';

const accounts = [
  {
    name: 'default',
    address: '8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW',
    token_name: 'NXS',
    balance: 0,
  },
  {
    name: 'trust',
    address: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
    token_name: 'NXS',
    balance: 40355.236479,
  },
];

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingVertical: 20,
});

export default function ReceiveScreen() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  return (
    <Wrapper>
      {accounts.map((account, i) => (
        <Account
          key={i}
          account={account}
          active={activeIndex === i}
          activate={() => {
            LayoutAnimation.easeInEaseOut();
            setActiveIndex(i);
          }}
        />
      ))}
    </Wrapper>
  );
}
