import React from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import filter from 'leo-profanity';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import App from './App';
import resources from './locales';

const init = async () => {
  const i18n = i18next.createInstance();
  await i18n
    .use(intervalPlural)
    .init({
      lng: 'ru',
      resources,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));
  return (
    <I18nextProvider i18n={i18n}>
      <div className="h-100 d-flex flex-column justify-content-between">
        <App />
      </div>
    </I18nextProvider>
  );
};

export default init;
