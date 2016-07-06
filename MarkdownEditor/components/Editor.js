import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import AceEditor from 'react-ace'
import brace from 'brace';
import 'brace/mode/python';
import 'brace/theme/github';

import { updateText } from '../actions'

const mapStateToProps = (state, ownProps) => ({
  value: state.editor.text
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange(text) {
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
        width="100%"
        showGutter={true}
        onChange={this.props.onChange}
        
        value={this.props.value}
        editorProps={{$blockScrolling: true}}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorComponent)
