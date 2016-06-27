import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

import { addTodo } from '../actions'

const App = () => (
  <div>
    <AddTodo
      onAdd={
        (value) => {
          dispatch(addTodo(value))
        }
      }
    />
    <VisibleTodoList />
    <Footer />
  </div>
);

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: () => {
      
    }
  }
}

export default App
