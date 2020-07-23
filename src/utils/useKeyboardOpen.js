import React from 'react';
import { Keyboard } from 'react-native';

export default function useKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = React.useState();
  React.useEffect(() => {
    const onShow = () => {
      setKeyboardOpen(true);
    };
    const onHide = () => {
      setKeyboardOpen(false);
    };
    Keyboard.addListener('keyboardDidShow', onShow);
    Keyboard.addListener('keyboardDidHide', onHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onShow);
      Keyboard.removeListener('keyboardDidHide', onHide);
    };
  }, []);
  return keyboardOpen;
}
