import axiosInstance from "@/config/instanceAxios";
import { userActionFailure, userActionStart, userActionSuccess } from "@/lib/slices/user/user.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserThunk = createAsyncThunk(
    "user",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(userActionStart());
        const response = await axiosInstance.get(`user/findById/${id}`);
  
        const data = JSON.parse(JSON.stringify(response.data));
  
        if (data) {
          dispatch(userActionSuccess(data));
          return fulfillWithValue(data);
        }
  
        return data;
      } catch (error: any) {
        dispatch(userActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  
  export const updateUserThunk = createAsyncThunk(
    "user",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(userActionStart());
        const response = await axiosInstance.put(`user/update/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(userActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(userActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  