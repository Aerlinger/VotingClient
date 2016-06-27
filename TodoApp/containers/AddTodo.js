import React from 'react'
import { connect } from 'react-redux'


let AddTodo = ({ onAdd }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        onAdd(input.value)
        input.value = ''
      }}>
        <input ref={node => {
          // Bind input to node on componentDidMount
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

AddTodo = connect()(AddTodo);

export default AddTodo
