import { createSlice } from '@reduxjs/toolkit';

// Initial state for repositories
const initialState = {
  repositories: [],
  loading: false,
  error: null,
  page: 1,
  timeFrame: '1m', // Default to 1 month
  hasMore: true,
};

// Create the repos slice
const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    // Action triggered when starting to fetch repositories
    fetchRepositoriesStart(state, action) {
      state.loading = true;
      state.error = null;
      
      // Reset repositories if it's a new search or time filter change
      if (action.payload?.reset) {
        state.repositories = [];
        state.page = 1;
        state.hasMore = true;
      }
    },
    
    // Action triggered on successful repository fetch
    fetchRepositoriesSuccess(state, action) {
      state.repositories = [...state.repositories, ...action.payload.items];
      state.loading = false;
      state.page = state.page + 1;
      state.hasMore = action.payload.items.length > 0;
    },
    
    // Action triggered on repository fetch error
    fetchRepositoriesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Action to change the time frame filter
    setTimeFrame(state, action) {
      state.timeFrame = action.payload;
    },
  },
});

// Export actions
export const {
  fetchRepositoriesStart,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setTimeFrame,
} = reposSlice.actions;

// Export reducer
export default reposSlice.reducer;