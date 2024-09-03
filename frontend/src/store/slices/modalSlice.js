/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalChannelId: '',
  modalChannelName: '',
  showModal: '',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setChannelModal(state, action) {
      state.modalChannelId = action.payload.id;
      state.modalChannelName = action.payload.name;
      state.showModal = action.payload.modalName;
    },
  },
});

export const {
  setChannelModal,
} = modalSlice.actions;
export default modalSlice.reducer;
