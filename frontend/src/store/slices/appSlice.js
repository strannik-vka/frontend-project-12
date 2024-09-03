/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('nickname') || '',
  currentChannelId: '',
  currentChannelName: '',
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
      const { name, id } = action.payload;
      state.currentChannelId = id;
      state.currentChannelName = name;
    },
  },
});

export const {
  setUserData, clearUserData, changeChannel,
} = appSlice.actions;
export default appSlice.reducer;
