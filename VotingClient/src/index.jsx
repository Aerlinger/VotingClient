import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';

import remoteActionMiddleware from './remote_action_middleware';
import { setState } from './action_creators';
import reducer from './reducer';
import App from './components/App';
import { VotingContainer } from './components/Voting';
import { ResultsContainer } from './components/Results';

const socket = io(`${location.protocol}//${location.hostname}:8090`)

/**
 * 4. When the message arrives on the server, the serverside Redux store handles the action, updating the vote in the
 * tally.
 * 5. The listener on the serverside Redux store broadcasts a state snapshot to all connected clients.
 * 6. A SET_STATE action is dispatched to the Redux store of every connected client.
 * 7. The Redux store of every connected client handles the SET_STATE action with the updated state from the server.
 * */
socket.on('state', state =>
  store.dispatch(setState(state))
);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);

const store = createStoreWithMiddleware(reducer);


const routes = <Route component={App}>
  <Route path="/results" component={ResultsContainer}/>
  <Route path="/" component={VotingContainer}/>
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,

  document.getElementById('app')
);
