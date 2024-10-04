import axiosInstance from "@/config/instanceAxios";
import { loginActionFailure, loginActionStart, loginActionSuccess, RegisterActionFailure, RegisterActionStart, RegisterActionSuccess } from "@/lib/slices/auth/auth.slice";
import { getCookies, setCookies } from "@/utils/functions";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk (
    "auth/signin",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
        try {
            dispatch(loginActionStart(requestData));
            const response = await axiosInstance.post("auth/login", requestData);
            const data = response.data;
            if (data) {
                setCookies("token", data.access_token);
                setCookies("user", data.id);
                //setCookies("USER_ROLE", data.roles[0]);

                
                
                dispatch(loginActionSuccess(data));
                return fulfillWithValue(data);
            }

            return response;
        } catch (error) {
            dispatch(loginActionFailure(error));
            return rejectWithValue({ message: "An error occurred" });
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/signup",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
        try {
            dispatch(RegisterActionStart());
            // Retrieve the API_URL from the .env file
            const requestDataJson = JSON.stringify(requestData);
            const response = await axiosInstance.post("auth/register", requestData);
      
            const data = JSON.parse(JSON.stringify(response.data));
            if (data) {
                dispatch(RegisterActionSuccess(data));
                return fulfillWithValue(data); // You can customize this error handling        
            }
            return response; 
        }catch (error: any) {
      dispatch(RegisterActionFailure(error));
      return rejectWithValue({ message: "An error occurred" });
    }
    }
);