import React from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import UnauthenticatedBase from './UnauthenticatedBase';
import AuthenticatedBase from './AuthenticatedBase';

export default function BaseScreen({ route, navigation }) {
  const theme = useTheme();
  const loggedIn = useSelector(selectLoggedIn);
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
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
