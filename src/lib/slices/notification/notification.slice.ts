import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notificationDetails: null,
    submitnotification: null,
    loading: false,
    error: null,
  },
  reducers: {
    notificationActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.notificationDetails = null;
    },
    notificationActionSuccess: (state, action) => {
      state.loading = false;
      state.notificationDetails = action.payload;
    },
    notificationActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.notificationDetails = null;
    },
  },
});

export const { notificationActionStart, notificationActionSuccess, notificationActionFailure } =
  notificationSlice.actions;

export default notificationSlice.reducer;
