import { createSlice } from "@reduxjs/toolkit";

const aitestSlice = createSlice({
  name: "aitest",
  initialState: {
    aiTests: [],
    currentTest: null,
    loading: false,
    result: null,
  },
  reducers: {
    setAiTests: (state, action) => {
      state.aiTests = action.payload;
    },
    setCurrentTest: (state, action) => {
      state.currentTest = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    clearCurrentTest: (state) => {
      state.currentTest = null;
      state.result = null;
    },
  },
});

export const { setAiTests, setCurrentTest, setLoading, setResult, clearCurrentTest } =
  aitestSlice.actions;
export default aitestSlice.reducer;