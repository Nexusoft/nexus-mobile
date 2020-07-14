import React from 'react';

import ScreenBody from 'components/ScreenBody';
import ApplicationSettings from './ApplicationSettings';
import CoreSettings from './CoreSettings';

export default function SettingsScreen() {
  return (
    <ScreenBody>
      <ApplicationSettings />

      <CoreSettings />
    </ScreenBody>
  );
}

SettingsScreen.nav = {
  name: 'Settings',
};
