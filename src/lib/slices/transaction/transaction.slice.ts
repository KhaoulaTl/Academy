import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactionDetails: null,
    submittransaction: null,
    loading: false,
    error: null,
  },
  reducers: {
    transactionActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.transactionDetails = null;
    },
    transactionActionSuccess: (state, action) => {
      state.loading = false;
      state.transactionDetails = action.payload;
    },
    transactionActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.transactionDetails = null;
    },
  },
});

export const { transactionActionStart, transactionActionSuccess, transactionActionFailure } =
  transactionSlice.actions;

export default transactionSlice.reducer;
