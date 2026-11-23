import React from 'react';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Select from 'components/Select';
import Text from 'components/Text';
import Switch from 'components/Switch';
import { updateSettings, selectSetting } from 'lib/settings';
import { selectLoggedIn } from 'lib/user';
import baseCurrencies from 'consts/baseCurrencies';
import SettingItem from './SettingItem';
import commonStyles from './styles';
import formatNumber from 'utils/formatNumber';
import { languages, resolveLanguage, t } from 'lib/i18n';

const styles = {
  ...commonStyles,
  switch: {
    marginLeft: 10,
  },
};

//a function so the texts are translated at render time
const getThemeOptions = () => [
  {
    value: 'auto',
    display: t('Auto'),
  },
  {
    value: 'dark',
    display: t('Dark'),
  },
  {
    value: 'light',
    display: t('Light'),
  },
];

export default function ApplicationSettings() {
  const loggedIn = useSelector(selectLoggedIn);
  const colorScheme = useSelector(selectSetting('colorScheme'));
  const language = useSelector(selectSetting('language'));
  const languageOptions = [
    {
      value: 'auto',
      display: t('Phone language ({name})', {
        name: languages[resolveLanguage('auto')],
      }),
    },
    ...Object.entries(languages).map(([value, display]) => ({ value, display })),
  ];
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const hideBalances = useSelector(selectSetting('hideBalances'));
  const ignoreSyncScreen = useSelector(selectSetting('ignoreSyncScreen'));
  const hideUnusedTrustAccount = useSelector(
    selectSetting('hideUnusedTrustAccount')
  );
  const pricePer = formatNumber(
    useSelector(({ market: { price } }) => price),
    { maximumFractionDigits: baseCurrency === 'VND' ? 0 : 3 }
  );

  return (
    <>
      <Text style={styles.title} sub>
        {t('Application')}
      </Text>
      <Surface style={styles.section}>
        <Select
          options={languageOptions}
          value={language}
          updateValue={(language) => {
            updateSettings({ language });
          }}
          render={({ display, openSelect }) => (
            <SettingItem
              title={t('Language')}
              description={display}
              primary
              onPress={openSelect}
            />
          )}
        />

        <Divider inset={20} />
        <Select
          options={getThemeOptions()}
          value={colorScheme}
          updateValue={(colorScheme) => {
            updateSettings({ colorScheme });
          }}
          render={({ display, openSelect }) => (
            <SettingItem
              title={t('Color scheme')}
              description={display}
              primary
              onPress={openSelect}
            />
          )}
        />

        {loggedIn && (
          <>
            <Divider inset={20} />
            <Select
              options={baseCurrencies}
              value={baseCurrency}
              updateValue={(baseCurrency) => {
                updateSettings({ baseCurrency });
              }}
              render={({ display, openSelect }) => (
                <SettingItem
                  title={t('Base currency')}
                  description={`${display}  ${pricePer}/NXS`}
                  primary
                  onPress={openSelect}
                />
              )}
            />

            <Divider inset={20} />
            <SettingItem
              title={t('Hide balances')}
              description={t('Hide balances on Overview screen')}
              right={
                <Switch
                  value={hideBalances}
                  onValueChange={(hideBalances) => {
                    updateSettings({ hideBalances });
                  }}
                />
              }
            />

            <Divider inset={20} />
            <SettingItem
              title={t('Hide unused trust account')}
              description={t('Hide trust account on Overview screen if account is not used')}
              right={
                <Switch
                  value={hideUnusedTrustAccount}
                  onValueChange={(hideUnusedTrustAccount) => {
                    updateSettings({ hideUnusedTrustAccount });
                  }}
                />
              }
            />
            <Divider inset={20} />
          </>
        )}

        <SettingItem
          title={t('Ignore database initialization')}
          description={t("Don't show the 'Initializing database' screen when the app initializes the blockchain database.")}
          right={
            <Switch
              value={ignoreSyncScreen}
              onValueChange={(value) => {
                updateSettings({ ignoreSyncScreen: !!value });
              }}
            />
          }
        />
      </Surface>
    </>
  );
}
