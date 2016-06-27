// ADD COUNTER
// REMOVE COUNTER


let CounterId = 0

export function addCounter() {
  return {
    type: "ADD_COUNTER",
    id: CounterId++
  }
}

export function removeCounter(id) {
  return {
    type: "REMOVE_COUNTER",
    id: id
  }
}
