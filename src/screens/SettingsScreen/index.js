import React from 'react';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import { selectLoggedIn } from 'lib/user';
import ApplicationSettings from './ApplicationSettings';
import UserSettings from './UserSettings';
import CoreSettings from './CoreSettings';

export default function SettingsScreen() {
  const loggedIn = useSelector(selectLoggedIn);
  return (
    <ScreenBody>
      <ApplicationSettings />
      {loggedIn && <UserSettings />}
      <CoreSettings />
    </ScreenBody>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
