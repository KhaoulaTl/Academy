import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryDetails: null,
    submitcategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    categoryActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.categoryDetails = null;
    },
    categoryActionSuccess: (state, action) => {
      state.loading = false;
      state.categoryDetails = action.payload;
    },
    categoryActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.categoryDetails = null;
    },
  },
});

export const { categoryActionStart, categoryActionSuccess, categoryActionFailure } =
  categorySlice.actions;

export default categorySlice.reducer;
