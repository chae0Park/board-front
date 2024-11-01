import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation.json';
import koTranslation from './kr/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            ko: { translation: koTranslation }
        },
        lng: 'en', // 기본 언어 설정
        fallbackLng: 'en', // 선택한 언어가 없을 경우 기본 언어
        interpolation: {
            escapeValue: false // React는 기본적으로 XSS를 방지하므로 false로 설정
        }
    });

export default i18n;
