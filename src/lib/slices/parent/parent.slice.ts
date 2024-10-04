import { createSlice } from "@reduxjs/toolkit";

const parentSlice = createSlice({
  name: "parent",
  initialState: {
    parentDetails: null,
    submitparent: null,
    loading: false,
    error: null,
  },
  reducers: {
    parentActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.parentDetails = null;
    },
    parentActionSuccess: (state, action) => {
      state.loading = false;
      state.parentDetails = action.payload;
    },
    parentActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.parentDetails = null;
    },
  },
});

export const { parentActionStart, parentActionSuccess, parentActionFailure } =
  parentSlice.actions;

export default parentSlice.reducer;
