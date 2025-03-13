import i18nBase from 'i18next';
import {initReactI18next} from 'react-i18next';
import translationEn from './en.json';
import translationFr from './fr.json';
import translationDe from './de.json';
import translationVi from './vi.json';
import translationEs from './es.json';
import translationTr from './tr.json';
import translationPt from './pt.json';
import translationAr from './ar.json';

import {Config, Locale} from '../constants/Config';
import {store} from 'app/store';

const lng = store.getState().application.appLanguage;

//console.log('THE CURRENT LANGUAGE: ', lng)

type Resources = Record<
  Locale,
  {
    translation:
      | typeof translationEn
      | typeof translationFr
      | typeof translationDe
      | typeof translationVi
      | typeof translationEs
      | typeof translationTr
      | typeof translationPt
      | typeof translationAr;
  }
>;

export const resources: Resources = {
  en: {
    translation: translationEn,
  },
  fr: {
    translation: translationFr,
  },
  de: {
    translation: translationDe,
  },
  vi: {
    translation: translationVi,
  },
  es: {
    translation: translationEs,
  },
  tr: {
    translation: translationTr,
  },
  pt: {
    translation: translationPt,
  },
  ar: {
    translation: translationAr,
  },
} as const;

i18nBase.use(initReactI18next).init({
  resources,
  fallbackLng: Config.defaultLanguage,
  debug: true,
  lng,
});

export const i18n = i18nBase;
