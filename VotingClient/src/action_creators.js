export function setState(state) {
  return {
    type: 'SET_STATE',
          state
  };
}

/**
 * 1. The user clicks a vote button. A VOTE action is dispatched.
 *
 * @param entry
 * @returns {{meta: {remote: boolean}, type: string, entry: *}}
 */
export function vote(entry) {
  return {
    meta: { remote: true },
    type: 'VOTE',
          entry
  };
}

export function next() {
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}
