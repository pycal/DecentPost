import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { initializeWeb3 } from './util/web3/getWeb3';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './components/App';
import Home from './components/Home';
import Send from './components/Send';
import Deliver from './components/Deliver';
import Receive from './components/Receive';

initializeWeb3();

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <MuiThemeProvider>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="send" component={Send}/>
            <Route path="deliver" component={Deliver}/>
            <Route path="receive" component={Receive}/>
          </Route>
        </Router>
      </MuiThemeProvider>
    </Provider>
  ),
  document.getElementById('root')
);
registerServiceWorker();
