import { setEntries, next, vote, INITIAL_STATE } from './core'

export default function reducer(state = INITIAL_STATE, action) {
  if (action.type == 'SET_ENTRIES') {
    return setEntries(state, action.entries);
  } else if (action.type == 'NEXT') {
    return next(state);
  } else if (action.type == 'VOTE') {
    return state.update('vote',
      voteState => vote(voteState, action.entry)
    );

  } else {
    return state
  }
}
