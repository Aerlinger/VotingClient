let CounterId = 0

export function addCounter(parentId) {
  return {
    type: "ADD_COUNTER",
    parentId: parentId,
    id: ++CounterId
  }
}

export function removeCounter(id) {
  return {
    type: "REMOVE_COUNTER",
    id: id
  }
}


export function incrementCounter(id) {
  return {
    type: "INCREMENT",
    id: id
  }
}

export function decrementCounter(id) {
  return {
    type: "DECREMENT",
    id: id
  }
}
