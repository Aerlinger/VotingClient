// INCREMENT
// DECREMENT


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


