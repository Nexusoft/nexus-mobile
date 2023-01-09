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
    const showListener = Keyboard.addListener('keyboardDidShow', onShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', onHide);
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  return keyboardOpen;
}
