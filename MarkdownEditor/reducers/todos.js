const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    case 'TOGGLE_TODO':
      return state.map(function(item) {
        if (item.id !== action.id) {
          return item
        }

        return Object.assign({}, item, {
          completed: !item.completed
        })
      });
    default:
      return state
  }
};

export default todos
