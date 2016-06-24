import ReactDOM from 'react-dom'
import React from 'react'
import {createStore} from 'redux'
import Counter from './components/Counter'
import counter from './reducers'

const store = createStore(counter);
let rootNode = window.document.querySelector("main");

function render() {
  ReactDOM.render(<Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
  />, rootNode);
}

render();
store.subscribe(render);
