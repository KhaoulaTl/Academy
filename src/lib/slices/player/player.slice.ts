import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    playerDetails: null,
    submitplayer: null,
    loading: false,
    error: null,
  },
  reducers: {
    playerActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.playerDetails = null;
    },
    playerActionSuccess: (state, action) => {
      state.loading = false;
      state.playerDetails = action.payload;
    },
    playerActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.playerDetails = null;
    },
  },
});

export const { playerActionStart, playerActionSuccess, playerActionFailure } =
  playerSlice.actions;

export default playerSlice.reducer;
