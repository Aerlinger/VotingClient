export const editor = (state = [], action) => {
  switch(action.type) {
    case 'UPDATE_TEXT':
      return ({
        text: action.text
      })
    default:
      return state
  }
};
