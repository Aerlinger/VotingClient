import React, {PropTypes} from 'react'
import { connect } from 'react-redux'

import Counter from '../components/Counter'
import AddCounter from '../components/AddCounter'
import {incrementCounter, decrementCounter, addCounter} from '../actions'

const mapStateToProps = (state, ownProps) => {
  let thisNode = state.counters[0];

  return ({
    id: 0,
    count: thisNode.count,
    children: thisNode.children.map(
      function (child) {
        return (
          <div>
            <pre>id: {child.id}</pre>
            <pre>cnt: {child.count}</pre>
            <pre>chldren: {child.children}</pre>
          </div>
        )
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
