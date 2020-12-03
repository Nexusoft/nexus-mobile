import React from 'react';
import { Keyboard } from 'react-native';
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
    Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
    Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
    };
  }, []);

  return (
    <BottomTabBar
      style={[style, hidden ? { display: 'none' } : null]}
      {...rest}
    />
  );
}
