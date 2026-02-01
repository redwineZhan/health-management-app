import { createSlice } from '@reduxjs/toolkit';

const healthSlice = createSlice({
  name: 'health',
  initialState: {
    metrics: [],
    trends: [],
    selectedMetric: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
    },
    addMetric: (state, action) => {
      state.metrics.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateMetric: (state, action) => {
      const index = state.metrics.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.metrics[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteMetric: (state, action) => {
      state.metrics = state.metrics.filter(m => m.id !== action.payload);
    },
    setTrends: (state, action) => {
      state.trends = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setMetrics, 
  setSelectedMetric, 
  addMetric, 
  updateMetric, 
  deleteMetric,
  setTrends
} = healthSlice.actions;

export default healthSlice.reducer;