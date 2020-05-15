import { loadSettings } from 'lib/settings';

export default async function loadInitialState() {
  const settings = await loadSettings();

  return {
    settings,
  };
}
