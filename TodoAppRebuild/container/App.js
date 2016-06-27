import React from 'react'
import { render } from 'react-dom'

import { AddTodo } from '../component/AddTodo'
import { TodoItems } from './TodoItems'
import { Filter } from '../component/TodoItem'

state = createState( reducers );

render(
  <div>
    <AddTodo />
    <TodoItems />
    <Filter />
  </div>
);
