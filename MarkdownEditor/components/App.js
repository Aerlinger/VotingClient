import React from 'react'
import Footer from './Footer'

import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

import brace from 'brace';
import AceEditor from 'react-ace';

import { addTodo } from '../actions'

import 'brace/mode/java';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change',newValue);
}



const App = () => (
  <div>

    <AceEditor
      mode="java"
      theme="github"
      onChange={onChange}
      name="ace-editor"
      editorProps={{$blockScrolling: true}}
    />

    

  </div>
);

export default App
