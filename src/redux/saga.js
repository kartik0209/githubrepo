import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import axios from 'axios';
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

// Helper to compute GitHub “created:>YYYY-MM-DD” param
function getSinceDate(timeFrame) {
  const now = new Date();
  if (timeFrame === '1w') now.setDate(now.getDate() - 7);
  else if (timeFrame === '2w') now.setDate(now.getDate() - 14);
  else now.setMonth(now.getMonth() - 1);
  return now.toISOString().split('T')[0];
}

function* fetchReposSaga(action) {
  try {
    const { page = 1 } = action.payload || {};
    // get selected timeframe from state
    const timeFrame = yield select((state) => state.repos.timeFrame);
    const since = getSinceDate(timeFrame);
    const response = yield call(axios.get,
      'https://api.github.com/search/repositories',
      { params: {
          q: `created:>${since}`,
          sort: 'stars',
          order: 'desc',
          page,
          per_page: 30,
        }
      }
    );
    yield put(fetchRepositoriesSuccess({ items: response.data.items }));
  } catch (err) {
    yield put(fetchRepositoriesFailure(err.message));
  }
}

function* fetchDetailsSaga(action) {
  try {
    const { owner, repo } = action.payload;
    const [freqRes, commitRes, contribRes] = yield all([
      call(axios.get, `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`),
      call(axios.get, `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`),
      call(axios.get, `https://api.github.com/repos/${owner}/${repo}/stats/contributors`),
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
