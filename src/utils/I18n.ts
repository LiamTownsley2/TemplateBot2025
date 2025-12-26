import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

const supportedLngs = ['en', 'fr'];

const baseConfig = {
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs,
  preload: supportedLngs,
  ns: ['commands'],
  defaultNS: 'commands',
  backend: {
    loadPath: path.join(__dirname, '..', 'locales/{{lng}}/{{ns}}.json'),
  },
  interpolation: {
    escapeValue: false,
  },
  debug: process.env.NODE_ENV === 'development',
};

const instances = new Map<string, typeof i18next>();

export async function initI18nInstances() {
  await i18next.use(Backend).init(baseConfig);

  for (const lng of supportedLngs) {
    const instance = i18next.cloneInstance({
      lng,
      initImmediate: false,
    });
    instances.set(lng, instance);
  }
}

export function getI18n(userLocale: string | null | undefined): typeof i18next {
  const _locale = userLocale?.split('-')[0];
  const validLocale = _locale && supportedLngs.includes(_locale) ? _locale : 'en';
  
  const instance = instances.get(validLocale);
  if (!instance) {
    console.warn(`No i18n instance for ${validLocale}, falling back to en`);
    return instances.get('en')!;
  }
  return instance;
}

export default i18next;