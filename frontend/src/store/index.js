import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice.js';
import modalReducer from './slices/modalSlice.js';
import { authApi } from '../api/auth';
import { channelsApi } from '../api/channels';
import { messagesApi } from '../api/messages';

export default configureStore({
  reducer: {
    modal: modalReducer,
    app: appReducer,
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware, channelsApi.middleware, messagesApi.middleware),
});
