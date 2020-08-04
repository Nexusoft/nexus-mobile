import React from 'react';
import { useSelector } from 'react-redux';

import ErrorDialog from 'components/ErrorDialog';
import SuccessDialog from 'components/SuccessDialog';
import InfoDialog from 'components/InfoDialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { closeDialog } from 'lib/ui';

// https://github.com/callstack/react-native-paper/blob/master/src/components/Modal.tsx#L48
const closeAnimationDuration = 220;

const dialogTypes = {
  error: ErrorDialog,
  success: SuccessDialog,
  info: InfoDialog,
  confirmation: ConfirmationDialog,
};

function Dialog({ id, type, ...rest }) {
  const [closing, setClosing] = React.useState(false);
  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      closeDialog(id);
    }, closeAnimationDuration);
  };

  const Component = dialogTypes[type];
  return <Component {...rest} onDismiss={dismiss} visible={!closing} />;
}

export default function Dialogs() {
  const dialogs = useSelector((state) => state.dialogs);

  return dialogs.map((dialog) => <Dialog key={dialog.id} {...dialog} />);
}
