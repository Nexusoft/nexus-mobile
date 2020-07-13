import React from 'react';
import { useSelector } from 'react-redux';

import Divider from 'components/Divider';
import Select from 'components/Select';
import { updateSettings } from 'lib/settings';
import { navigate } from 'lib/navigation';
import SettingItem from './SettingItem';

const coreOptions = [
  { value: 'embedded', display: 'Embedded Core' },
  { value: 'external', display: 'External Core' },
];

export default function CoreSettings() {
  const settings = useSelector((state) => state.settings);
  const setCoreMode = React.useCallback(
    (coreMode) => {
      updateSettings({ coreMode });
    },
    [settings.coreMode]
  );

  return (
    <>
      <Select
        options={coreOptions}
        value={settings.coreMode}
        updateValue={setCoreMode}
        render={({ display, openSelect }) => (
          <SettingItem
            title="Nexus Core mode"
            description={display}
            primary
            onPress={openSelect}
          />
        )}
      />
      {settings.coreMode === 'external' && (
        <>
          <Divider inset={20} />
          <SettingItem
            title="External Core configuration"
            right="arrow"
            onPress={() => {
              navigate('ExternalCoreConfig');
            }}
          />
        </>
      )}
    </>
  );
}
