import {React, PropTypes} from 'react'
import {render} from 'react-dom'
import TodoItem from '../component/TodoItem'

import { connect } from 'redux'

const TodoItems = ({todos, onTodoClick}) => (
  <ul>
    {
      todos.map(
        todo =>
          <TodoItem
            onClick=onTodoClick
            completed=todo.completed
            text=todo.text
          />
      )
    }
  </ul>
);

// Link TodoItems to state

export default TodoItems

