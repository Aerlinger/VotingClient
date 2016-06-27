import React, {PropTypes} from 'react'
import { connect } from 'react-redux'

import Counter from '../components/Counter'
import AddCounter from '../components/AddCounter'
import {incrementCounter, decrementCounter, addCounter} from '../actions'

const mapStateToProps = (state, ownProps) => {
  console.log(`Current state: ${state}`);
  let thisNode = state.counters[0];

  return ({
    id: thisNode.id,
    count: thisNode.count,
    children: thisNode.children.map(
      function (child) {
        return {
          id: child.id,
          count: child.count,
          children: child.children
        };
      }
    )
  });

}

const mapDispatchToProps = (dispatch, ownProps) => {
  return ({
    onIncrementClick: () => {
      dispatch(incrementCounter(0))
    },
    onDecrementClick: () => {
      dispatch(decrementCounter(0))
    },
    onAddCounterClick: () => {
      dispatch(addCounter())
    }
  })
}

class RootComponent extends React.Component {
  // ({id, count, counters, onIncrementClick, onDecrementClick, onAddCounterClick}) => {
  //   let removeLink = null

  static get defaultProps() {
    return {
      id: 0,
      count: 0
    }
  }

  render() {
    return (
      <div>
        <span>RootCounter #{this.props.id}: {this.props.count}</span>
        <a onClick={(id) => this.props.onIncrementClick(id)}> + </a>
        <a onClick={(id) => this.props.onDecrementClick(id)}> - </a>

        { this.props.children }

        <AddCounter
          onClick={(id) => this.props.onAddCounterClick(id)}
        />
      </div>
    )
  }
}

let BaseComponent = connect(mapStateToProps, mapDispatchToProps)(RootComponent)


/*
 RootCounter.propTypes = {
 id: PropTypes.number.isRequired,
 count: PropTypes.number.isRequired,
 children: PropTypes.array.isRequired,
 onIncrementClick: PropTypes.func.isRequired,
 onDecrementClick: PropTypes.func.isRequired,
 onAddCounterClick: PropTypes.func.isRequired,
 }
 */


export default BaseComponent
