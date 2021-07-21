import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ns1 from './en/en.json';
import ns2 from './es/es.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        interpolation: { escapeValue: false }, // React already does escaping
        lng: 'en', // language to use
        resources: {
            en: {
                common: ns1, // 'common' is our custom namespace
            },
            es: {
                common: ns2,
            },
        },
    });

export default i18n;
