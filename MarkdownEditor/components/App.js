import React from 'react'
// import Footer from './Footer'

import brace from 'brace';
import Editor from './Editor';
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
        <Editor
          onChange={ (text) => console.log(text) }
        />

        <MDReactComponent text="Some text with **emphasis!**"/>
      </div>
    )
  }
}
