import axiosInstance from "@/config/instanceAxios";
import { categoryActionFailure, categoryActionStart, categoryActionSuccess } from "@/lib/slices/category/category.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createCategoryThunk = createAsyncThunk(
    "category",
    async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(categoryActionStart());
        const response = await axiosInstance.post("categories", requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(categoryActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(categoryActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getAllCategoriesThunk = createAsyncThunk(
    "category",
    async (_: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(categoryActionStart());
        const response = await axiosInstance.get("categories");
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(categoryActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(categoryActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const getCategoryThunk = createAsyncThunk(
    "category",
    async (id: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
      try {
        dispatch(categoryActionStart());
        const response = await axiosInstance.get(`categories/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(categoryActionSuccess(data));
          return fulfillWithValue(data);
        }
        return response;
      } catch (error: any) {
        dispatch(categoryActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  
  export const updateCategoryThunk = createAsyncThunk(
    "category",
    async (
      { id, requestData }: { id: string; requestData: any },
      { dispatch, rejectWithValue, fulfillWithValue }
    ) => {
      try {
        dispatch(categoryActionStart());
        const response = await axiosInstance.put(`categories/${id}`, requestData);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
          dispatch(categoryActionSuccess(data));
          return fulfillWithValue(data);
        }
        return data;
      } catch (error: any) {
        dispatch(categoryActionFailure(error));
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  export const deleteCategoryThunk = createAsyncThunk(
    "category",
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`categories/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
  );
  