import React, { PropTypes } from 'react'

let AddCounter = ({onClick}) => {
  return(
    <a onClick={onClick}>
      Add Counter
    </a>
  )
}

export default AddCounter
