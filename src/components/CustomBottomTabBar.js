import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

const showEvent = Platform.select({
  android: 'keyboardDidShow',
  ios: 'keyboardWillShow',
});
const hideEvent = Platform.select({
  android: 'keyboardDidHide',
  ios: 'keyboardWillHide',
});

export default function CustomBottomTabBar({ style, ...rest }) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const handleKeyboardShow = () => {
      setHidden(true);
    };
    const handleKeyboardHide = () => {
      setHidden(false);
    };
    const showListener = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideListener = Keyboard.addListener(hideEvent, handleKeyboardHide);
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <BottomTabBar
      style={[style, hidden ? { display: 'none' } : null]}
      {...rest}
    />
  );
}
