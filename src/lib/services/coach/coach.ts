import axiosInstance from "@/config/instanceAxios";
import { coachActionFailure, coachActionStart, coachActionSuccess } from "@/lib/slices/coach/coach.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createCoachThunk = createAsyncThunk(
    "coach",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(coachActionStart());
        const response = await axiosInstance.post("coaches", requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(coachActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(coachActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getAllCoachesThunk = createAsyncThunk(
    "coach",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(coachActionStart());
        const response = await axiosInstance.get("coaches");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(coachActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(coachActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getCoachThunk = createAsyncThunk(
    "coach",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(coachActionStart());
        const response = await axiosInstance.get(`coaches/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(coachActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(coachActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  export const updateCoachThunk = createAsyncThunk(
    "coach",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(coachActionStart());
        const response = await axiosInstance.put(`coaches/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(coachActionSuccess(data));
          return fulfillWithValue(data);
        }
        return data;
      } catch (error: any) {
        dispatch(coachActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const deleteCoachThunk = createAsyncThunk(
    "coach",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`coaches/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  