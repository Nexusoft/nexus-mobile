import React from 'react';
import styled from '@emotion/native';
import { Modal as PaperModal, Portal } from 'react-native-paper';

import { Surface } from 'components/Adaptive';

const ModalWrapper = styled(Surface)({
  marginVertical: 50,
  marginHorizontal: 30,
  borderRadius: 2,
});

export default function Modal({ children, style, ...rest }) {
  return (
    <Portal>
      <PaperModal {...rest}>
        <ModalWrapper style={style}>{children}</ModalWrapper>
      </PaperModal>
    </Portal>
  );
}