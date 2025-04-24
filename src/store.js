import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reposReducer from './redux/repoSlice';
import detailsReducer from './redux/detailsSlice';
import rootSaga from './redux/saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    repos: reposReducer,
    details: detailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false })
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
