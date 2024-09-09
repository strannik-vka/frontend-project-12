import React from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import App from './App';
import resources from './locales';
import { messagesApi } from './api/messages';
import { socket } from './context/socket';
import store from './store/index';
import { channelsApi } from './api/channels';
import { changeChannel, defaultChannel } from './store/slices/appSlice';
import { filter } from './context/filter';

const init = async () => {
  const { dispatch } = store;

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

  socket.on('newMessage', (newMessage) => {
    dispatch(messagesApi.util.updateQueryData('getMessages', undefined, (draft) => {
      draft.push(newMessage);
    }));
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
      draft.push(channel);
    }));
  });

  socket.on('removeChannel', ({ id }) => {
    const { app } = store.getState();

    if (id === app.currentChannel.id) {
      dispatch(changeChannel(defaultChannel));
    }

    dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
      const index = draft.findIndex((curChannels) => curChannels.id === id);
      draft.splice(index, 1);
    }));
  });

  socket.on('renameChannel', ({ id, name }) => {
    dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
      const channel = draft;
      const index = channel.findIndex((curChannels) => curChannels.id === id);
      channel[index].name = name;
    }));
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
