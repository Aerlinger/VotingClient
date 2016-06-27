export default function counters(state = [], action) {
  if (action.type == "ADD_COUNTER") {
    return [
      ...state,
      {
        id: action.id,
        count: 0,
        subcounters: []
      }
    ]
  } else if (action.type == "REMOVE_COUNTER") {
    return state.map(function(item) {
      if (item.id != action.id) {
        return item;
      }
    });
  } else if (action.type == "INCREMENT") {
    console.log("INCREMENT");
    console.log(state);
    console.log(action);

    return state.map(function (item) {
      if (item.id == action.id) {
        return Object.assign({}, item, {
          count: item.count + 1
        })
      } else {
        return item;
      }
    })

  } else if (action.type == "DECREMENT") {

    return state.map(function (item) {
      if (item.id == action.id) {
        return Object.assign({}, item, {
          count: item.count - 1
        })
      } else {
        return item;
      }
    })

  } else {
    return state;
  }
}
