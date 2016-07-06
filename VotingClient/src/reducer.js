import { List, Map } from 'immutable'

/**
 
 * 
 * @param state
 * @param newState
 * @returns {*}
 */
function setState(state, newState) {
  return state.merge(newState);
}

/* 3. The client-side Redux store handles the action, causing the local hasVote state to be set. */
function vote(state, entry) {
  const currentPair = state.getIn(['vote', 'pair']);

  if (currentPair && currentPair.includes(entry)) {
    return state.set('hasVoted', entry);
  } else {
    return state;
  }
}

/**
 * Removes `has_voted`
 *
 * @param state
 * @param entry
 */
function resetVote(state, entry) {
  const hasVoted = state.get('hasVoted');
  const currentPair = state.getIn(['vote', 'pair'], List());

  if (hasVoted && !currentPair.includes(hasVoted)) {
    return state.remove('hasVoted');
  } else {
    return state;
  }
}

export default function(state=Map(), action) {
  switch(action.type) {
    case 'SET_STATE':
      return resetVote(setState(state, action.state));
    case 'VOTE':
      return vote(state, action.entry);
  }
  
  return state
}
