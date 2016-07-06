import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

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
