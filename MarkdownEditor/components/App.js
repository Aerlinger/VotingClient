import React from 'react'

import Editor from './Editor';
import MarkdownFrame from './MarkdownFrame';


export default class App extends React.Component {

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
