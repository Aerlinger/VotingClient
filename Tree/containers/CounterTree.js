import { connect } from 'react-redux'
import React, {PropTypes} from 'react'

import { incrementCounter, decrementCounter, addCounter, removeCounter } from '../actions'
import Counter from '../components/Counter'

function findNode(root, id) {
  console.log(`Searching for ${id} found: ${root.id} in ${Object.keys(root)}`)
  if (root && root.id == id) {
    return root;
  } else {
    if (root.subcounters) {
      for (let node of root.subcounters) {
        let childNode = findNode(node, id)

        if (childNode) {
          return childNode;
        }
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  let thisNode = findNode(state, ownProps.id)

  /*
  for (let node of state.counters) {
    let childNode = findNode(node, ownProps.id)

    if (childNode) {
      thisNode = childNode;
    }
  }
  */

  if (thisNode) {
    return ({
      id: thisNode.id,
      count: thisNode.count,
      subcounters: thisNode.subcounters
    });
  } else {
    return ({
      id: 0,
      count: 0,
      subcounters: []
    });
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return ({
    onIncrementClick: (id) => {
      dispatch(incrementCounter(id))
    },
    onDecrementClick: (id) => {
      dispatch(decrementCounter(id))
    },
    onAddCounterClick: () => {
      dispatch(addCounter())
    },
    onRemoveCounterClick: (id) => {
      dispatch(removeCounter(id))
    }
  })
}

const CounterTree = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

export default CounterTree
