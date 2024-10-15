import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    eventDetails: null,
    submitevent: null,
    loading: false,
    error: null,
  },
  reducers: {
    eventActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.eventDetails = null;
    },
    eventActionSuccess: (state, action) => {
      state.loading = false;
      state.eventDetails = action.payload;
    },
    eventActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.eventDetails = null;
    },
  },
});

export const { eventActionStart, eventActionSuccess, eventActionFailure } =
  eventSlice.actions;

export default eventSlice.reducer;
