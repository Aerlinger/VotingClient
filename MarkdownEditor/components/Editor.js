import React, { PropTypes } from 'react'
import AceEditor from 'react-ace'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updateText } from '../actions'


const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange(text) {
    console.log("dipatch: ", dispatch)
    console.log("dipatch (own): ", ownProps)

    dispatch(updateText(text))
  }
});

class EditorComponent extends React.Component {
  static get propTypes() {
    return {
      onChange: PropTypes.func.isRequired
    }
  }

  render() {
    return (
      <AceEditor
        mode="python"
        theme="github"
        name="ace-editor"
        onChange={this.props.onChange}
        editorProps={{$blockScrolling: true}}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorComponent)
