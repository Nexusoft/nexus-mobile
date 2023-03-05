import React from 'react';
import { useSelector } from 'react-redux';

import ErrorDialog from 'components/ErrorDialog';
import SuccessDialog from 'components/SuccessDialog';
import InfoDialog from 'components/InfoDialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import PinDialog from 'components/PinDialog';
import OnboardingDialog from 'components/OnboardingDialog';
import OptionsDialog from 'components/OptionsDialog';
import { closeDialog } from 'lib/ui';

// https://github.com/callstack/react-native-paper/blob/master/src/components/Modal.tsx#L48
const closeAnimationDuration = 220;

const dialogTypes = {
  error: ErrorDialog,
  success: SuccessDialog,
  info: InfoDialog,
  confirmation: ConfirmationDialog,
  pinConfirmation: PinDialog,
  onboard: OnboardingDialog,
  options: OptionsDialog,
};

function Dialog({ id, type, ...rest }) {
  const [closing, setClosing] = React.useState(false);
  const dismiss = () => {
    // First set visible={false} for dialog so it fades out
    setClosing(true);
    // After fade out animation, remove the dialog
    setTimeout(() => {
      closeDialog(id);
    }, closeAnimationDuration);
  };

  const Component = dialogTypes[type];
  return <Component {...rest} onDismiss={dismiss} visible={!closing} />;
}

export default function Dialogs() {
  const dialogs = useSelector((state) => state.ui.dialogs);

  return dialogs.map((dialog) => <Dialog key={dialog.id} {...dialog} />);
}
