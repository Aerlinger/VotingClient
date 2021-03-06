### Pure Components:

1. A pure component receives all its data as props, like a function receives all its data as arguments. It should have no side effects, including reading data from anywhere else, initiating network requests, etc.
2. A pure component generally has no internal state. What it renders is fully driven by its input props. Rendering the same pure component twice with the same props should result in the same UI. There's no hidden state inside the component that would cause the UI to differ between the two renders.

*This has a similar simplifying effect as using pure functions does: We can figure out what a component does by looking at what it receives as inputs and what it renders. There's nothing else we need to know about the component. We can also test it really easily - almost as easily as we were able to test our pure application logic.*

*If components can't have state, where will the state be? In an immutable data structure inside a Redux store! We've already seen how that works. The big idea is to separate the state from the user interface code. The React components are just a stateless projection of the state at a given point in time.*


### Redux:

**Two responsibilities:**

1. Map Store state into input component props
2. Mapping actions into component output callback props

### Routing:
- The root component App doesn't really need anything since it doesn't use any data.
- `Vote` and `Winner` are only used by parent components that give them all the props they need. They don't need wiring up either.
- What's left are the components we use in routes: `Voting` and `Results`. They are currently getting data in as hardcoded placeholder props from `App`. These are the components that need to be wired up to the Store.


### Client-side Lifecycle:

1. The user clicks a vote button. A VOTE action is dispatched.
2. The remote action middleware sends the action over the Socket.io connection.
3. The client-side Redux store handles the action, causing the local hasVote state to be set.
4. When the message arrives on the server, the serverside Redux store handles the action, updating the vote in the tally.
5. The listener on the serverside Redux store broadcasts a state snapshot to all connected clients.
6. A SET_STATE action is dispatched to the Redux store of every connected client.
7. The Redux store of every connected client handles the SET_STATE action with the updated state from the server.
