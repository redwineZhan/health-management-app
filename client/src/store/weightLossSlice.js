import { createSlice } from '@reduxjs/toolkit';

const weightLossSlice = createSlice({
  name: 'weightLoss',
  initialState: {
    plans: [],
    dailyLogs: [],
    selectedPlan: null,
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
    setPlans: (state, action) => {
      state.plans = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    addPlan: (state, action) => {
      state.plans.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updatePlan: (state, action) => {
      const index = state.plans.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    setDailyLogs: (state, action) => {
      state.dailyLogs = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDailyLog: (state, action) => {
      state.dailyLogs.push(action.payload);
      state.loading = false;
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setPlans, 
  setSelectedPlan, 
  addPlan, 
  updatePlan,
  setDailyLogs,
  addDailyLog
} = weightLossSlice.actions;

export default weightLossSlice.reducer;