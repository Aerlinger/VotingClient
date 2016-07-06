import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import makeStore from '../src/store';

describe('store', () => {
  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    const initial_state = Map();

    expect(store.getState()).to.equal(initial_state);

    store.dispatch({
      type: 'SET_ENTRIES',
      entries: ['Trainspotting', '28 Days Later']
    });

    expect(
      store.getState()
    ).to.equal(
      fromJS({
        entries: ['Trainspotting', '28 Days Later']
      })
    );
  });
})

