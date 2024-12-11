import axiosInstance from "@/config/instanceAxios";
import { notificationActionFailure, notificationActionStart, notificationActionSuccess } from "@/lib/slices/notification/notification.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllNotificationsThunk = createAsyncThunk(
    "notification",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(notificationActionStart());
        const response = await axiosInstance.get("notifications");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(notificationActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(notificationActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );

  export const deleteNotificationThunk = createAsyncThunk(
    "notification",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`notifications/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );