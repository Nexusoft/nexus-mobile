import React from 'react';

import ScreenBody from 'components/ScreenBody';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';
import SecuritySettings from './SecuritySettings';

export default function SettingsScreen() {
  return (
    <ScreenBody>
      <ApplicationSettings />
      <SecuritySettings />
      <CoreSettings />
    </ScreenBody>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
