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
