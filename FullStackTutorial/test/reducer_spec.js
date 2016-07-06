import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const state = Map()

    expect(
      reducer(state, { type: "SET_ENTRIES", entries: ['Trainspotting', 'Sunshine', '28 Days later'] })
    ).to.equal(
      fromJS({
        entries: ['Trainspotting', 'Sunshine', '28 Days later']
      })
    )
  });

  it('handles NEXT', () => {
    const state = fromJS({
      entries: ['Trainspotting', 'Sunshine', '28 Days later']
    })

    expect(
      reducer(state, { type: "NEXT" })
    ).to.equal(
      fromJS({
        vote:    {
          pair: ['Trainspotting', 'Sunshine']
        },
        entries: ['28 Days later']
      })
    )
  });

  it('handles VOTE', () => {
    const state = fromJS({
      vote:    {
        pair: ['Trainspotting', 'Sunshine']
      },
      entries: ['28 Days later']
    })

    expect(
      reducer(state, { type: "VOTE", entry: "Trainspotting" })
    ).to.equal(
      fromJS({
        vote:    {
          pair:  ['Trainspotting', 'Sunshine'],
          tally: {
            'Trainspotting': 1
          }
        },
        entries: ['28 Days later']
      })
    )
  });

  it('has an initial state', () => {
    const action = {
      type:    'SET_ENTRIES',
      entries: ['Trainspotting']
    };

    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('can be used with reduce', () => {
    const actions    = [
      { type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later'] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'VOTE', entry: '28 Days Later' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'NEXT' }
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Trainspotting'
    }));
  });
});

