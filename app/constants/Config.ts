/**
 * @Project Summarised
 * @File Config.ts
 * @Path app/constants
 * @Author BRICE ZELE
 * @Date 05/03/2023
 */

import Env from 'react-native-config';

export enum Locale {
  en = 'en',
  fr = 'fr',
  de = 'de',
  vi = 'vi',
  es = 'es',
  tr = 'tr',
  pt = 'pt',
  ar = 'ar',
}

interface IConfig {
  enableSentry: boolean | undefined;
  sentryDsn: string | undefined;
  defaultLanguage: Locale;
  onesignalAppId: string | undefined;
  languageSupport: Array<Locale>;
}

const {APP_SENTRY_DSN, APP_ENABLE_SENTRY, APP_ONESIGNAL_ID} = Env;

const _config: IConfig = {
  sentryDsn: process.env.APP_SENTRY_DSN || APP_SENTRY_DSN,
  onesignalAppId: process.env.APP_ONESIGNAL_ID || APP_ONESIGNAL_ID,
  enableSentry: parseBoolean(APP_ENABLE_SENTRY),
  defaultLanguage: Locale.en,
  languageSupport: [Locale.fr, Locale.en],
};

function parseBoolean(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}

export const Config = Object.freeze(_config);
