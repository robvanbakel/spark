import { createI18n } from 'vue-i18n';

import en_US from '@/locales/en-US';
import nl_NL from '@/locales/nl-NL';

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': en_US,
    'nl-NL': nl_NL,
  },
});

export default i18n;
