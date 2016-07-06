import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Markdown from 'markdown-it/dist/markdown-it.js'
import MDReactComponent from 'markdown-react-js'

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
      <MDReactComponent
        text={this.props.text}
      />
    )
  }
}

export default connect(mapStateToProps)(MarkdownComponent)
