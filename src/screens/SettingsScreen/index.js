import React from 'react';

import ScreenBody from 'components/ScreenBody';
import ApplicationSettings from './ApplicationSettings';
import UserSettings from './UserSettings';
import CoreSettings from './CoreSettings';

export default function SettingsScreen() {
  return (
    <ScreenBody>
      <ApplicationSettings />
      <UserSettings />
      <CoreSettings />
    </ScreenBody>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
