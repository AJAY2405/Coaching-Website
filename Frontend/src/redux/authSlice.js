import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Set user data
        setUser: (state, action) => {
            state.user = action.payload;
        },
        // ✅ Clear user data on logout
        logout: (state) => {
            state.user = null;
            state.loading = false;
        }
    }
});

export const { setLoading, setUser, logout } = authSlice.actions; // ✅ Export logout too
export default authSlice.reducer;
