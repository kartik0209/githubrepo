import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  fetchCodeFrequency,
  fetchCommitActivity,
  fetchContributors,
} from '../../api/github';
import {
  fetchDetailsStart,
  fetchDetailsSuccess,
  fetchDetailsFailure,
} from '../detailsSlice';

/**
 * Saga for fetching repository details
 * @param {Object} action - The dispatched action
 */
function* fetchDetailsSaga(action) {
  try {
    const { owner, repo } = action.payload;
    
    // Make all API calls in parallel
    const [codeFrequency, commitActivity, contributors] = yield all([
      call(fetchCodeFrequency, owner, repo),
      call(fetchCommitActivity, owner, repo),
      call(fetchContributors, owner, repo),
    ]);
    
    // Construct repository info object
    const repoInfo = {
      owner,
      name: repo,
    };
    
    // Dispatch success action with all data
    yield put(
      fetchDetailsSuccess({
        codeFrequency,
        commitActivity,
        contributors,
        repoInfo,
      })
    );
  } catch (error) {
    // Dispatch failure action with error message
    yield put(fetchDetailsFailure(error.message));
  }
}

/**
 * Watcher saga for details actions
 */
export function* watchDetails() {
  yield takeLatest(fetchDetailsStart.type, fetchDetailsSaga);
}