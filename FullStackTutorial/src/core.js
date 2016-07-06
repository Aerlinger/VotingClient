/**
 * Core Actions
 */
import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

/**
 * Initialize state
 *
 * @param state Base state
 * @param entries initial entries
 * @returns {
 *   entries: ['firstItem', 'secondItem', 'thirdItem', ...]
 *   // ...
 * }
 */
export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

/**
 * Remove two items from entries, place them in the vote object
 *
 * @param state Initialized state
 * @returns {
 *   vote: {
 *     items: ['firstItem', 'secondItem']
 *   }
 *   entries: ['thirdItem', ...]
 *   // ...
 * }
 */
export function next(state) {
  const entries = state.get('entries')
                       .concat(_getWinners(state.get('vote')))

  if (entries.size === 1) {
    // We're at the last entry, we can set state.winner to the last winning entry
    return state.remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  } else {
    return state.merge({
      vote:    Map({
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    });
  }
}

/**
 * Recalculate tally after vote
 *
 * @param state pre-vote state
 * @param entry String representation of winning entry
 * @returns {
 *   vote: {
 *     items: []
 *     tally: {
 *        'firstItem': 1
 *     }
 *   }
 *
 *   entries: ['thirdItem', ...]
 *   // ...
 * }
 */
export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],  // Key: state['vote']['tally'][entry] = state['vote']['tally'][entry] + 1 (init to zero)
    0,  // Initial state
    tally => tally + 1
  );
}

/**
 * Get winners from vote
 *
 * @param state pre-vote state
 * @returns List of winners (Multiple if tie)
 */
export function _getWinners(vote) {
  if (!vote) return [];

  const [a, b] = vote.get('pair');

  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}

