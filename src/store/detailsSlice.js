import { createSlice } from '@reduxjs/toolkit';

// Initial state for repository details
const initialState = {
  codeFrequency: [],
  commitActivity: [],
  contributors: [],
  repoInfo: null,
  loading: false,
  error: null,
  selectedMetric: 'changes', // 'changes', 'additions', or 'deletions'
};

// Create the details slice
const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    // Action triggered when starting to fetch repository details
    fetchDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    
    // Action triggered on successful details fetch
    fetchDetailsSuccess(state, action) {
      state.loading = false;
      state.codeFrequency = action.payload.codeFrequency;
      state.commitActivity = action.payload.commitActivity;
      state.contributors = action.payload.contributors;
      state.repoInfo = action.payload.repoInfo;
    },
    
    // Action triggered on details fetch error
    fetchDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Action to change the selected metric
    setSelectedMetric(state, action) {
      state.selectedMetric = action.payload;
    },
    
    // Action to reset details state (e.g., when navigating away)
    resetDetails() {
      return initialState;
    },
  },
});

// Export actions
export const {
  fetchDetailsStart,
  fetchDetailsSuccess,
  fetchDetailsFailure,
  setSelectedMetric,
  resetDetails,
} = detailsSlice.actions;

// Export reducer
export default detailsSlice.reducer;