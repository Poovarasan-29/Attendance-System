import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import attendanceReducer from './slices/attendanceSlice'; // Keeping for now if needed, or remove later
import { apiSlice } from './apiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        attendance: attendanceReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
