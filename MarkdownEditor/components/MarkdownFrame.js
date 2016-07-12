import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import ReactMarkdown from 'react-markdown'

const mapStateToProps = (state, ownProps) => {
  return {
    text: state.editor.text
  }
}

class MarkdownComponent extends React.Component {
  static get propTypes() {
    return {
      text: PropTypes.string.isRequired
    }
  }

  render() {
    return (
      <ReactMarkdown
        source={this.props.text}
      />
    )
  }
}

export default connect(mapStateToProps)(MarkdownComponent)
