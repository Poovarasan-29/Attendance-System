import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/attendance';

const getToken = () => localStorage.getItem('token');

const config = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});

export const checkIn = createAsyncThunk('attendance/checkIn', async (_, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/checkin`, {}, config());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const checkOut = createAsyncThunk('attendance/checkOut', async (_, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/checkout`, {}, config());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const getMyHistory = createAsyncThunk('attendance/getMyHistory', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/my-history`, config());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const getMySummary = createAsyncThunk('attendance/getMySummary', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/my-summary`, config());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const getTodayStatus = createAsyncThunk('attendance/getTodayStatus', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/today`, config());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

const initialState = {
    attendanceHistory: [],
    summary: null,
    todayStatus: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkIn.fulfilled, (state, action) => {
                state.todayStatus = action.payload;
                state.isSuccess = true;
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.todayStatus = action.payload;
                state.isSuccess = true;
            })
            .addCase(getMyHistory.fulfilled, (state, action) => {
                state.attendanceHistory = action.payload;
            })
            .addCase(getMySummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(getTodayStatus.fulfilled, (state, action) => {
                state.todayStatus = action.payload;
            });
    },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
