import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { routerMiddleware } from 'react-router-redux'
import logger from 'redux-logger';
import { browserHistory } from 'react-router';

import web3Reducer from './util/web3/web3Reducer';

import contractReducer from './reducers/contractReducer';
import accountReducer from './reducers/accountReducer';

import { reducer as reduxFormReducer } from 'redux-form';

const middleware = routerMiddleware(browserHistory);

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  contract: contractReducer,
  form: reduxFormReducer,
  account: accountReducer
})

const store = createStore(
  reducer,
  applyMiddleware(middleware, logger)
);

export default store;
