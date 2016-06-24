// Exampl state:
// {
//   visibilityFilter: 'SHOW_ALL',
//     todos: [
//   {
//     text: 'Consider using Redux',
//     completed: true,
//   },
//   {
//     text: 'Keep all state in a single tree',
//     completed: false
//   }
// ]
// }

import {VisibilityFilters} from './actionTypes'

// Define our initial state
const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      });
    case "TOGGLE_TODO":
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if (index == action) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
        })
      });
    default:
      return state
  }
}

function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {

}

/**
 * Reducer function to apply an action to a state in our oup
 *
 * @param state
 * @param action
 * @returns newState
 */
function todoApp(state = initialState, action) {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    case "ADD_TODO":
    case "TOGGLE_TODO":
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      });
    default:
      return state;
  }
}
