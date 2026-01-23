import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ca from './locales/ca.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import hi from './locales/hi.json'
import bn from './locales/bn.json'
import id from './locales/id.json'
import ar from './locales/ar.json'
import ur from './locales/ur.json'

const resources = {
  ca: { translation: ca },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },
  bn: { translation: bn },
  id: { translation: id },
  ar: { translation: ar },
  ur: { translation: ur }
}

// Llegeix l'idioma de la cookie i18nextLng
function getLanguageFromCookie() {
  const match = document.cookie.match(/(?:^|; )i18nextLng=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageFromCookie() || 'ca',
    fallbackLng: 'ca',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
