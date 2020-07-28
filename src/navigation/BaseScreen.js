import React from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import { navigate, navReadyRef } from 'lib/navigation';
import { getStore } from 'store';
import UnauthenticatedBase from './UnauthenticatedBase';
import AuthenticatedBase from './AuthenticatedBase';

export default function BaseScreen({ route, navigation }) {
  const theme = useTheme();
  const loggedIn = useSelector(selectLoggedIn);
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
  // Fix default BottomTab screen being the first tab when login state changes
  React.useEffect(() => {
    const store = getStore();
    store.observe(selectLoggedIn, (loggedIn) => {
      if (!navReadyRef.current) return;
      if (loggedIn) {
        navigate('Overview');
      } else {
        navigate('Login');
      }
    });
  }, []);
  React.useLayoutEffect(() => {
    if (loggedIn) {
      const options = AuthenticatedBase.stackOptions({
        theme,
        navigation,
        txFilterOpen,
        contactSearch,
        route,
      });
      navigation.setOptions(options);
    } else {
      const options = UnauthenticatedBase.stackOptions({
        theme,
      });
      navigation.setOptions(options);
    }
  }, [route, theme, loggedIn, txFilterOpen, contactSearch, navigation]);

  return loggedIn ? <AuthenticatedBase /> : <UnauthenticatedBase />;
}

BaseScreen.nav = {
  name: 'Base',
};
