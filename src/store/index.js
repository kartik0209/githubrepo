import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reposReducer from './repoSlice';
import detailsReducer from './detailsSlice';
import rootSaga from './saga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store with reducers and middleware
const store = configureStore({
  reducer: {
    repos: reposReducer,
    details: detailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      thunk: false,
      serializableCheck: false // Disable for simplicity in this demo
    }).concat(sagaMiddleware),
});

// Run saga middleware with root saga
sagaMiddleware.run(rootSaga);

export default store;