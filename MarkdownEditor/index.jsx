import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux'

import AppReducers from './reducers'
import App from './components/App'
import MarkdownSplitPane from './containers/MarkdownSplitPane'


const store = createStore(
  AppReducers,
  {
    editor: {
      text: "### Replace me"
    }
  },
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const routes = <Route component={App}>
  <Route path="/" component={MarkdownSplitPane} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('root')
);
