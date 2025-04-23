import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchRepositories } from '../../api/github';
import {
  fetchRepositoriesStart,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setTimeFrame,
} from '../repoSlice';

/**
 * Saga for fetching repositories
 * @param {Object} action - The dispatched action
 */
function* fetchRepositoriesSaga(action) {
  try {
    const state = yield select((state) => state.repos);
    const { page, timeFrame } = state;
    
    // If we're changing the time frame, we'll reset the page
    const currentPage = action.payload?.reset ? 1 : page;
    
    // Call the API
    const data = yield call(fetchRepositories, timeFrame, currentPage);
    
    // Dispatch success action with repositories
    yield put(fetchRepositoriesSuccess(data));
  } catch (error) {
    // Dispatch failure action with error message
    yield put(fetchRepositoriesFailure(error.message));
  }
}

/**
 * Saga for handling time frame changes
 */
function* changeTimeFrameSaga() {
  // When time frame changes, we want to reset the repositories
  yield put(fetchRepositoriesStart({ reset: true }));
}

/**
 * Watcher saga for repositories actions
 */
export function* watchRepos() {
  yield takeLatest(fetchRepositoriesStart.type, fetchRepositoriesSaga);
  yield takeLatest(setTimeFrame.type, changeTimeFrameSaga);
}