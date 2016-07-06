import React from 'react'
import Footer from './Footer'

import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

import brace from 'brace';
import AceEditor from 'react-ace';
import Markdown from 'markdown-it/dist/markdown-it.js'
import MDReactComponent from 'markdown-react-js'

import { addTodo } from '../actions'

import 'brace/mode/python';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change',newValue);
}



const App = () => (
  <div>

    <AceEditor
      mode="python"
      theme="github"
      onChange={onChange}
      name="ace-editor"
      editorProps={{$blockScrolling: true}}
    />

    <MDReactComponent text="Some text with **emphasis!**"/>

  </div>
);

export default App
