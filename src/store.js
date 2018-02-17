import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import logger from 'redux-logger';

import web3Reducer from './util/web3/web3Reducer';

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer
})

const store = createStore(
  reducer,
  applyMiddleware(logger)
);

export default store;
