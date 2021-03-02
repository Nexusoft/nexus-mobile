import React from 'react';
import { Dialog as PaperDialog } from 'react-native-paper';
import { BackHandler, Platform } from 'react-native';

export default function Dialog({
  visible,
  onDismiss,
  closeOnBackPress = true,
  ...rest
}) {
  React.useEffect(() => {
    if (Platform.OS === 'android' && closeOnBackPress && visible) {
      const handleBack = () => {
        onDismiss?.();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBack);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
      };
    }
  }, [!!visible, onDismiss]);

  return <PaperDialog visible={visible} onDismiss={onDismiss} {...rest} />;
}

Dialog.Title = PaperDialog.Title;
Dialog.Content = PaperDialog.Content;
Dialog.ScrollArea = PaperDialog.ScrollArea;
Dialog.Actions = PaperDialog.Actions;
