import React from 'react'

import Editor from '../components/Editor';
import MarkdownFrame from '../components/MarkdownFrame';


export default class MarkdownSplitPane extends React.Component {

  render() {
    return (
      <div>
        <div style={{float: "left", width: "50%"}}>
          <Editor
            text={this.props.text}
          />
        </div>

        <div style={{float: "left", width: "49%", border: '1px solid lightgrey'}}>
          <MarkdownFrame />
        </div>
      </div>

    )
  }
}
