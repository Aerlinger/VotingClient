import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import AppReducers from './reducers'
import App from './components/App'

const store = createStore(
  AppReducers,
  {
    editor: {
      text: "### Replace me"
    }
  },
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
