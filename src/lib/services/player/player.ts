import axiosInstance from "@/config/instanceAxios";
import { playerActionFailure, playerActionStart, playerActionSuccess } from "@/lib/slices/player/player.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createPlayerThunk = createAsyncThunk(
    "player",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(playerActionStart());
        const response = await axiosInstance.post("players", requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(playerActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(playerActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getAllPlayersThunk = createAsyncThunk(
    "player",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(playerActionStart());
        const response = await axiosInstance.get("players");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(playerActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(playerActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getPlayerThunk = createAsyncThunk(
    "player",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(playerActionStart());
        const response = await axiosInstance.get(`players/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(playerActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(playerActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  export const updatePlayerThunk = createAsyncThunk(
    "player",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(playerActionStart());
        const response = await axiosInstance.put(`players/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(playerActionSuccess(data));
          return fulfillWithValue(data);
        }
        return data;
      } catch (error: any) {
        dispatch(playerActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const deletePlayerThunk = createAsyncThunk(
    "player",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`players/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );

  export const findGroupedPlayersThunk = createAsyncThunk(
    "player/by-coach",
    async (coachId, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(playerActionStart());
        const response = await axiosInstance.get(`players/by-coach/${coachId}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(playerActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(playerActionFailure(error));
        return rejectWithValue({ message: "An error occurred while fetching grouped players" });
      }
    }
  );
  
  