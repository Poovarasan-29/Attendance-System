import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Attendance', 'User', 'Dashboard'],
    endpoints: (builder) => ({
        // Auth Endpoints
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

        // Attendance Endpoints
        checkIn: builder.mutation({
            query: () => ({
                url: '/attendance/checkin',
                method: 'POST',
            }),
            invalidatesTags: ['Attendance', 'Dashboard'],
        }),
        checkOut: builder.mutation({
            query: () => ({
                url: '/attendance/checkout',
                method: 'POST',
            }),
            invalidatesTags: ['Attendance', 'Dashboard'],
        }),
        getMyHistory: builder.query({
            query: () => '/attendance/my-history',
            providesTags: ['Attendance'],
        }),
        getMySummary: builder.query({
            query: () => '/attendance/my-summary',
            providesTags: ['Attendance'],
        }),
        getTodayStatus: builder.query({
            query: () => '/attendance/today',
            providesTags: ['Attendance'],
        }),

        // Manager Endpoints
        getAllAttendance: builder.query({
            query: () => '/attendance/all',
            providesTags: ['Attendance'],
        }),
        getManagerStats: builder.query({
            query: () => '/dashboard/manager',
            providesTags: ['Dashboard'],
        }),
        getAllEmployees: builder.query({
            query: () => '/users',
            providesTags: ['User'],
        }),
        getDepartments: builder.query({
            query: () => '/data/departments',
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useCheckInMutation,
    useCheckOutMutation,
    useGetMyHistoryQuery,
    useGetMySummaryQuery,
    useGetTodayStatusQuery,
    useGetAllAttendanceQuery,
    useGetManagerStatsQuery,
    useGetAllEmployeesQuery,
    useGetDepartmentsQuery
} = apiSlice;
