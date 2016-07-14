### IPython Kernel Interface w/ Bluebird


### `client.js`
*Backend service class to make API calls to IPythonKernel. Communicates via stdio*

  **checkPython**
  
  **JuptyerClient:**
    - getVariables
    - getAutoCompletion
    - getEval
    - getInspection
    - getDocStrings
    - isCompletion
    - *execute
    - *getResults
  
  **getPythonScriptResults**
    
### `ipc-dispatcher`
*Listens for and dispatches responses from IPython Kernel to Redux actions*

  **IPython Kernel:**
    `iopubDispatcher`:
      > Jupyter sends IOPUB events to broadcast to every client connected to a session.  Various components may be
      > listening and reacting to these independently, without connection to each other.
      > @param {function} dispatch
     
    `shellDispatcher` 
    `stdinDispatcher`
    
    *Dispatches actions:*
    
    ```javascript
    iopubDispatchMap = {
        execute_input: dispatchIOPubExecuteInput,
        stream: dispatchIOPubStream,
        execute_result: dispatchIOPubResult,
        display_data: dispatchIOPubDisplayData,
        error: dispatchIOPubError,
        status: dispatchIOPubStatus,
        comm_msg: dispatchNoop,
        comm_open: dispatchNoop,
        clear_output: dispatchNoop
      }
    
    shellDispatchMap = {
      execute_reply: dispatchShellExecuteReply*
    }
      
    detectVariables = _.debounce(function (dispatch) {
      dispatch(kernelActions.detectKernelVariables());
    }
    ```
    
    
  **Internal**
    `internalDispatcher`:
    
    ```javascript
    SHOW_PREFERENCES: () => dialogActions.showPreferences(),
    CHECK_FOR_UPDATES: () => applicationActions.checkForUpdates(),
    TOGGLE_DEV_TOOLS: () => applicationActions.toggleDevTools(),
    QUIT: () => applicationActions.quit(),
    SAVE_ACTIVE_FILE: () => editorTabGroupActions.saveActiveFile(),
    SHOW_SAVE_FILE_DIALOG: () => editorTabGroupActions.showSaveFileDialogForActiveFile(),
    SHOW_OPEN_FILE_DIALOG: () => editorTabGroupActions.showOpenFileDialogForActiveFile(),
    FOCUS_ACTIVE_ACE_EDITOR: () => editorTabGroupActions.focus(),
    FOCUS_ACTIVE_TERMINAL: () => terminalActions.focus(),
    FOCUS_NEWEST_PLOT: () => plotViewerActions.focusNewestPlot(),
    TERMINAL_INTERRUPT: () => terminalActions.interrupt(),
    TERMINAL_RESTART: () => terminalActions.restart()
    ```
    
### `client-response.js`

*Internal routing within application: Map requests/responses to components that dispatched them*
    
    `handle(client, response)`: Map JupyterClient and JupyterClientResponse to relevant component/action 