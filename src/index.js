import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { initializeWeb3 } from './util/web3/getWeb3';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import App from './components/App';
import './index.css';

initializeWeb3();

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);
registerServiceWorker();
