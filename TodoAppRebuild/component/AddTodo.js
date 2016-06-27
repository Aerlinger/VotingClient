import React from 'react'
import {render} from 'react-dom'

let AddTodo = ({ dispatch }) => {
  return (
    <form onSubmit={
    e => {
      e.preventDefault()
      if(!input.value.trim()) {
       return
      }

      dispatch(addTodo(input.value))
      input.value = ''
    }
  }>

      <input type="text" ref={
      node => {
        input = node
      }
    }
      />
      <button type="submit">Add todo</button>
    </form>
  )

}