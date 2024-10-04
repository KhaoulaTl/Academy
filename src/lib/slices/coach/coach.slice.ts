import { createSlice } from "@reduxjs/toolkit";

const coachSlice = createSlice({
  name: "coach",
  initialState: {
    coachDetails: null,
    submitcoach: null,
    loading: false,
    error: null,
  },
  reducers: {
    coachActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.coachDetails = null;
    },
    coachActionSuccess: (state, action) => {
      state.loading = false;
      state.coachDetails = action.payload;
    },
    coachActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.coachDetails = null;
    },
  },
});

export const { coachActionStart, coachActionSuccess, coachActionFailure } =
  coachSlice.actions;

export default coachSlice.reducer;
