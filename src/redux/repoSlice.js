import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repositories: [],
  loading: false,
  error: null,
  page: 1,
  timeFrame: '1m', // '1w', '2w', '1m'
  hasMore: true,
};

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    fetchRepositoriesStart(state, action) {
      state.loading = true;
      state.error = null;
      if (action.payload?.reset) {
        state.repositories = [];
        state.page = 1;
        state.hasMore = true;
      }
    },
    fetchRepositoriesSuccess(state, action) {
      state.repositories = [...state.repositories, ...action.payload.items];
      state.loading = false;
      state.page += 1;
      state.hasMore = action.payload.items.length > 0;
    },
    fetchRepositoriesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setTimeFrame(state, action) {
      state.timeFrame = action.payload;
    },
  },
});

export const {
  fetchRepositoriesStart,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setTimeFrame,
} = reposSlice.actions;

// alias for use in components
export const fetchRepos = fetchRepositoriesStart;

export default reposSlice.reducer;
