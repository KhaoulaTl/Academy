import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userDetails: null,
    submitUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginActionStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.userDetails = null;
    },
    loginActionSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    },
    loginActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userDetails = null;
    },
    RegisterActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.submitUser = null;
    },
    RegisterActionSuccess: (state, action) => {
      state.loading = false;
      state.submitUser = action.payload;
    },
    RegisterActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.submitUser = null;
    },
    ForgetPasswordActionStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.userDetails = null;
    },
    ForgetPasswordActionSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    },
    ForgetPasswordActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userDetails = null;
    },
  },
});

export const {
  loginActionStart,
  loginActionSuccess,
  loginActionFailure,
  RegisterActionStart,
  RegisterActionSuccess,
  RegisterActionFailure,
  ForgetPasswordActionStart,
  ForgetPasswordActionSuccess,
  ForgetPasswordActionFailure
} = authSlice.actions;

export default authSlice.reducer;
