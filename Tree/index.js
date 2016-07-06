import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import CountersApp from './reducers'
import BaseComponent from './containers/RootCounter'
import CounterTree from './containers/CounterTree'
import {incrementCounter, decrementCounter, addCounter, removeCounter} from './actions'

let store = createStore(CountersApp, {
    counters: [
      {
        id: 0,
        count: 0,
        children: []
      }
    ]
  },
  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
);
let rootNode = window.document.getElementById("root")

render(
  <Provider store={store}>
    <BaseComponent />
  </Provider>,
  rootNode
);

// <CounterTree id={0} count={0}/>