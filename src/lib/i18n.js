//UI texts: the English text is the key, src/consts/locales/<code>.js maps it to the
//translation; a text missing there shows in English
//t() is called at render time, never in module level constants (they would stay English)
import { NativeModules, Platform } from 'react-native';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fil';
import 'moment/locale/fr';
import 'moment/locale/hr';
import 'moment/locale/id';
import 'moment/locale/it';
import 'moment/locale/nl';
import 'moment/locale/pl';
import 'moment/locale/pt';
import 'moment/locale/tr';

import de from 'consts/locales/de';
import es from 'consts/locales/es';
import fil from 'consts/locales/fil';
import fr from 'consts/locales/fr';
import hr from 'consts/locales/hr';
import id from 'consts/locales/id';
import it from 'consts/locales/it';
import nl from 'consts/locales/nl';
import pl from 'consts/locales/pl';
import pt from 'consts/locales/pt';
import tr from 'consts/locales/tr';

//name of each language in itself, in the order the settings list shows them
export const languages = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fil: 'Filipino',
  fr: 'Français',
  hr: 'Hrvatski',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  tr: 'Türkçe',
};

const packs = { de, es, fil, fr, hr, id, it, nl, pl, pt, tr };

function deviceLocale() {
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      return settings?.AppleLocale || settings?.AppleLanguages?.[0] || 'en';
    }
    if (Platform.OS === 'android') {
      return NativeModules.I18nManager?.localeIdentifier || 'en';
    }
    return (typeof navigator !== 'undefined' && navigator.language) || 'en';
  } catch (err) {
    return 'en';
  }
}

//'auto' = the phone's language when the app has it, else English
export function resolveLanguage(setting) {
  if (setting && setting !== 'auto') return languages[setting] ? setting : 'en';
  const code = deviceLocale().toLowerCase().replace('_', '-');
  //tl is the older code for Filipino
  const base = code.startsWith('tl') ? 'fil' : code.split('-')[0];
  return languages[base] ? base : 'en';
}

let pack = null;
let current = 'en';

export function setLanguage(setting) {
  current = resolveLanguage(setting);
  pack = packs[current] || null;
  moment.locale(current);
}

export const currentLanguage = () => current;

export function t(text, vars) {
  let result = (pack && pack[text]) || text;
  if (vars) {
    result = result.replace(/\{(\w+)\}/g, (match, key) =>
      vars[key] === undefined || vars[key] === null ? match : String(vars[key])
    );
  }
  return result;
}
