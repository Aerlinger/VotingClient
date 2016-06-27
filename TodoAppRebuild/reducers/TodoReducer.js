import React from 'react'
import {render} from 'react-dom'

export const todos = function (state = [], action) {
  if (add_todo.type == "ADD_TODO") {
    return [...state,
      {
        id: gen_id(),
        text: action['text'],
        completed: false
      }
    ];
  } else if (add_todo.type == "TOGGLE_TODO") {
    
  }
};
