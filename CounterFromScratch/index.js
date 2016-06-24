import { createStore } from 'redux'
import ReactDOM from 'react-dom'
import React from 'react'
import Counter from './components/Counter'
import count from './reducers/count'

const store = createStore(count);
const rootNode = window.document.querySelector("main");

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    rootNode
  )
}

render();
store.subscribe(render);
