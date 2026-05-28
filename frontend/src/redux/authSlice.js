import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        isAuthenticated: false,
        error: null,
        userRole: null, // 'student' or 'recruiter'
        token: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.userRole = action.payload?.role || null;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            state.userRole = null;
            state.error = null;
        }
    }
});

export const {
    setLoading,
    setUser,
    setToken,
    setError,
    clearError,
    logout
} = authSlice.actions;

export default authSlice.reducer;
