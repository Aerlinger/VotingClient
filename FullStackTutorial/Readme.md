# Full Stack Redux tutorial


### Lifecycle
1. A client sends an action to the server
2. The server hands the action to Redux Store
3. The store calls the reducer, and the reducer executes the logic related to the action
4. The store updates its state based on the return value of the reducer
5. The store executes the listener function
6. The server emits a 'state' event
7. All connected clients receive the new state
