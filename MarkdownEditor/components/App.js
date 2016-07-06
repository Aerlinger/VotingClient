import React from 'react'
// import Footer from './Footer'

import brace from 'brace';
import Editor from './Editor';
import MarkdownFrame from './MarkdownFrame';
import Markdown from 'markdown-it/dist/markdown-it.js'
import MDReactComponent from 'markdown-react-js'

import { updateText } from '../actions'

import 'brace/mode/python';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change', newValue);
}

export default class App extends React.Component {

  render() {
    return (
      <div>
        <div style={{float: "left", width: "50%"}}>
          <Editor
            text={this.props.text}
          />
        </div>

        <div style={{float: "left", width: "50%"}}>
          <MarkdownFrame />
        </div>
      </div>
    )
  }
}
