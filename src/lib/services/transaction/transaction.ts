import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/instanceAxios";
import { 
  transactionActionFailure, 
  transactionActionStart, 
  transactionActionSuccess 
} from "@/lib/slices/transaction/transaction.slice";

export const createTransactionThunk = createAsyncThunk(
  "transaction/create",
  async (requestData: any, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      dispatch(transactionActionStart());
      const response = await axiosInstance.post("transactions", requestData);
      const data = response.data;
      if (data) {
        dispatch(transactionActionSuccess(data));
        return fulfillWithValue(data);
      }
      return response;
    } catch (error: any) {
      dispatch(transactionActionFailure(error));
      return rejectWithValue({ message: "An error occurred while creating the transaction" });
    }
  }
);


export const getTransactionHistoryThunk = createAsyncThunk(
  "transaction/getHistory",
  async (playerId: string, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      dispatch(transactionActionStart());
      const response = await axiosInstance.get(`transactions/${playerId}`);
      const data = response.data;
      if (data) {
        dispatch(transactionActionSuccess(data));
        return fulfillWithValue(data);
      }
      return response;
    } catch (error: any) {
      dispatch(transactionActionFailure(error));
      return rejectWithValue({ message: "An error occurred while fetching transaction history" });
    }
  }
);

export const getAllTransactionsThunk = createAsyncThunk(
  "transaction/getAll",  // Unique action type for this thunk
  async (_, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      dispatch(transactionActionStart());
      const response = await axiosInstance.get("transactions");
      const data = response.data;
      if (data) {
        dispatch(transactionActionSuccess(data));
        return fulfillWithValue(data);
      }
      return response;
    } catch (error: any) {
      dispatch(transactionActionFailure(error));
      return rejectWithValue({ message: "An error occurred while fetching all transactions" });
    }
  }
);


export const payTransactionThunk = createAsyncThunk(
  "transaction/pay",
  async (requestData: { playerId: string; amount: number }, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      dispatch(transactionActionStart());
      const response = await axiosInstance.post("transactions/pay", requestData);
      const data = response.data;
      if (data) {
        dispatch(transactionActionSuccess(data));
        return fulfillWithValue(data);
      }
      return response;
    } catch (error: any) {
      dispatch(transactionActionFailure(error));
      return rejectWithValue({ message: "An error occurred while processing the payment" });
    }
  }
);

  export const deleteTransactionThunk = createAsyncThunk(
    "transaction/delete",
    async (id:string, {dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`transactions/${id}`);
        const data = JSON.parse(JSON.stringify(response.data));

        return response;
      } catch (error: any) {
        return rejectWithValue({ message: "An error occurred" });
      }
    }
);

export const getRevenueByPeriodThunk = createAsyncThunk(
  "transaction/revenue",
  async (period: 'day' | 'week' | 'month', { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(`Fetching revenue for period: ${period}`); // Ajoutez ce log
      const response = await axiosInstance.get(`transactions/revenue/${period}`);
      console.log("API response:", response.data); // Ajoutez ce log
      const data = response.data;
      if (data) {
        dispatch(transactionActionSuccess(data));
        return fulfillWithValue(data);
      }
      return response;
    } catch (error: any) {
      console.error("Error fetching revenue:", error); // Ajoutez ce log
      dispatch(transactionActionFailure(error));
      return rejectWithValue({ message: "An error occurred while fetching revenue" });
    }
  }
);