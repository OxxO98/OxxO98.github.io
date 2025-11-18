import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import ja from './locale/ja';
import ko from './locale/ko';

export const defaultNS = 'translation';
export const resources = {
    ko : {
        ...ko,
    },
    ja : {
        ...ja
    }
}

i18n.use(initReactI18next).init({
    lng : localStorage.getItem('language') || 'ko',
    resources,
    defaultNS,
    fallbackLng : 'ko'
})

export default i18n;