// src/redux/saga.js
import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import {
  fetchRepositoriesStart,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
} from './repoSlice';
import {
  fetchDetailsStart,
  fetchDetailsSuccess,
  fetchDetailsFailure,
} from './detailsSlice';
import githubService from '../api/github';

function* fetchReposSaga(action) {
  try {
    const { page = 1 } = action.payload || {};
    // get selected timeframe from state
    const timeFrame = yield select((state) => state.repos.timeFrame);
    
    const response = yield call(githubService.searchRepositories, timeFrame, page);
    yield put(fetchRepositoriesSuccess({ items: response.data.items }));
  } catch (err) {
    yield put(fetchRepositoriesFailure(err.message));
  }
}

function* fetchDetailsSaga(action) {
  try {
    const { owner, repo } = action.payload;
    
    // Make parallel API calls for better performance
    const [freqRes, commitRes, contribRes] = yield all([
      call(githubService.getCodeFrequency, owner, repo),
      call(githubService.getCommitActivity, owner, repo),
      call(githubService.getContributors, owner, repo),
    ]);
    
    yield put(fetchDetailsSuccess({
      codeFrequency: freqRes.data,
      commitActivity: commitRes.data,
      contributors: contribRes.data,
    }));
  } catch (err) {
    yield put(fetchDetailsFailure(err.message));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(fetchRepositoriesStart.type, fetchReposSaga),
    takeLatest(fetchDetailsStart.type, fetchDetailsSaga),
  ]);
}