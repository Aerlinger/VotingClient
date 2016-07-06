// ADD todo
// REMOVE todo

// SHOW ALL
// SHOW ACTIVE
// SHOW COMPLETED

let nextTodoId = 0;

export const updateText = (text) => ({
  type: 'UPDATE_TEXT',
  text
});
