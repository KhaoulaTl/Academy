import axiosInstance from "@/config/instanceAxios";
import { eventActionFailure, eventActionStart, eventActionSuccess } from "@/lib/slices/event/event.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createEventThunk = createAsyncThunk(
    "event",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(eventActionStart());
        const response = await axiosInstance.post("events", requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(eventActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(eventActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getAllEventsThunk = createAsyncThunk(
    "event",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(eventActionStart());
        const response = await axiosInstance.get("events");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(eventActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(eventActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getEventThunk = createAsyncThunk(
    "event",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(eventActionStart());
        const response = await axiosInstance.get(`events/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(eventActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(eventActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  export const updateEventThunk = createAsyncThunk(
    "event",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(eventActionStart());
        const response = await axiosInstance.put(`events/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(eventActionSuccess(data));
          return fulfillWithValue(data);
        }
        return data;
      } catch (error: any) {
        dispatch(eventActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const deleteEventThunk = createAsyncThunk(
    "event",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`events/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  