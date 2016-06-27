import { combineReducers } from 'redux'

import counters from './counters'

const countersApp = combineReducers({
  counters: counters
});

export default countersApp;
