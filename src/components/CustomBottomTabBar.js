import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export default function CustomBottomTabBar({ style, ...rest }) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const handleKeyboardShow = () => {
      setHidden(true);
    };
    const handleKeyboardHide = () => {
      setHidden(false);
    };
    const showEvent = Platform.select({
      android: 'keyboardDidShow',
      ios: 'keyboardWillShow',
    });
    const hideEvent = Platform.select({
      android: 'keyboardDidHide',
      ios: 'keyboardWillHide',
    });
    Keyboard.addListener(showEvent, handleKeyboardShow);
    Keyboard.addListener(hideEvent, handleKeyboardHide);
    return () => {
      Keyboard.removeListener(showEvent, handleKeyboardShow);
      Keyboard.removeListener(hideEvent, handleKeyboardHide);
    };
  }, []);

  return (
    <BottomTabBar
      style={[style, hidden ? { display: 'none' } : null]}
      {...rest}
    />
  );
}
