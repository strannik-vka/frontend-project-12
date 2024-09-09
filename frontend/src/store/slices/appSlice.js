/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const defaultChannel = {
  id: '1',
  name: 'general',
};

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('nickname') || '',
  currentChannel: {},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserData(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.nickname;
    },
    clearUserData(state) {
      state.token = null;
      state.username = '';
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
    },
    changeChannel(state, action) {
      state.currentChannel = action.payload;
    },
  },
});

export const {
  setUserData, clearUserData, changeChannel,
} = appSlice.actions;
export default appSlice.reducer;
