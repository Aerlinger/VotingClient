import React, { Component, PropTypes } from 'react'

class Counter extends Component {
  constructor(props){
    super(props)
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props;
    return (
      <div>
        <p>{ value }</p>
        <a onClick={ onIncrement }> + </a>
        <a onClick={ onDecrement }> - </a>
      </div>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
};

export default Counter;
