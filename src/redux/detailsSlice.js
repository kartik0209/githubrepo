import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  codeFrequency: [],
  commitActivity: [],
  contributors: [],
  loading: false,
  error: null,
  selectedMetric: 'changes', // 'changes' | 'additions' | 'deletions'
};

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    fetchDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDetailsSuccess(state, action) {
      state.loading = false;
      state.codeFrequency = action.payload.codeFrequency;
      state.commitActivity = action.payload.commitActivity;
      state.contributors = action.payload.contributors;
    },
    fetchDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedMetric(state, action) {
      state.selectedMetric = action.payload;
    },
    resetDetails() {
      return initialState;
    },
  },
});

export const {
  fetchDetailsStart,
  fetchDetailsSuccess,
  fetchDetailsFailure,
  setSelectedMetric,
  resetDetails,
} = detailsSlice.actions;

export default detailsSlice.reducer;
