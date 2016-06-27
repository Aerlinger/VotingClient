export const addTodo = function(index, text) {
  return {
    type: "ADD_TODO",
    index: index,
    text: text
  }
};

export const toggleTodo = function(name, index) {
  return {
    type: "TOGGLE_TODO",
    index: index
  }
};

export const filterTodo = function(scope) {
  return {
    type: "FILTER_TODO",
    scope: scope
  }
};
