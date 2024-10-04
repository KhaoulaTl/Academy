import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails: null,
    submitUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    userActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.userDetails = null;
    },
    userActionSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    },
    userActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userDetails = null;
    },
  },
});

export const { userActionStart, userActionSuccess, userActionFailure } =
  userSlice.actions;

export default userSlice.reducer;
