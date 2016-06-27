import React, {PropTypes} from 'react'

import AddCounter from './AddCounter'

let Counter =
  ({id, count, subcounters, onIncrementClick, onDecrementClick, onAddCounterClick, onRemoveCounterClick}) => {
    let removeLink = null

    if (onRemoveCounterClick)
      removeLink = <a onClick={(id) => onRemoveCounterClick(id)}> X </a>

    return (
      <div>
        <span>Counter #{id}: {count}</span>
        <a onClick={(id) => onIncrementClick(id)}> + </a>
        <a onClick={(id) => onDecrementClick(id)}> - </a>

        { removeLink }

        <ul style={{"paddingLeft": "5px"}}>
          {
            subcounters.map(function (subcounter) {
              return (
                <li>
                  <Counter
                    id={subcounter.id}
                    count={subcounter.count}
                    subcounters={subcounter.subcounters}
                    onIncrementClick={subcounter.onIncrementClick}
                    onDecrementClick={subcounter.onDecrementClick}
                    onAddCounterClick={subcounter.onAddCounterClick}
                    onRemoveCounterClick={subcounter.onRemoveCounterClick}
                  />
                </li>
              )
            })
          }
        </ul>

        <AddCounter
          onClick={(id) => onAddCounterClick(id)}
        />
      </div>
    )
  }

Counter.propTypes = {
  id: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  subcounters: PropTypes.array.isRequired,
  onIncrementClick: PropTypes.func.isRequired,
  onDecrementClick: PropTypes.func.isRequired,
  onAddCounterClick: PropTypes.func.isRequired,
  onRemoveCounterClick: PropTypes.func
}


export default Counter
