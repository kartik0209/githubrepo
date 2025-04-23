import { all } from 'redux-saga/effects';
import { watchRepos } from './repoSaga';
import { watchDetails } from './detailsSaga';

// Root saga combines all other sagas
export default function* rootSaga() {
  yield all([
    watchRepos(),
    watchDetails(),
  ]);
}