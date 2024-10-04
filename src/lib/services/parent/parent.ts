import axiosInstance from "@/config/instanceAxios";
import { parentActionFailure, parentActionStart, parentActionSuccess } from "@/lib/slices/parent/parent.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createParentThunk = createAsyncThunk(
    "parent",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(parentActionStart());
        const response = await axiosInstance.post("parents", requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(parentActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(parentActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getAllParentsThunk = createAsyncThunk(
    "parent",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(parentActionStart());
        const response = await axiosInstance.get("parents");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(parentActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(parentActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getParentThunk = createAsyncThunk(
    "parent",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(parentActionStart());
        const response = await axiosInstance.get(`parents/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(parentActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(parentActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  export const updateParentThunk = createAsyncThunk(
    "parent",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(parentActionStart());
        const response = await axiosInstance.put(`parents/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(parentActionSuccess(data));
          return fulfillWithValue(data);
        }
        return data;
      } catch (error: any) {
        dispatch(parentActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const deleteParentThunk = createAsyncThunk(
    "parent",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`parents/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  