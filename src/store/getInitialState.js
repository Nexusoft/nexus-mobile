import { loadSettings } from "lib/settings";

export default async function getInitialState() {
  const settings = await loadSettings();

  return {
    settings,
  };
}
