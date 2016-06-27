import React from 'react'
import { render } from 'react-dom'


let FilterLink = function(text, scope) {
  <a
    onClick={dispatch(filterTodo(scope))}
  >
    {text}
  </a>
}
