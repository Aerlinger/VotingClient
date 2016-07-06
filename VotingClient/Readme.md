### Pure Components:

1. A pure component receives all its data as props, like a function receives all its data as arguments. It should have no side effects, including reading data from anywhere else, initiating network requests, etc.
2. A pure component generally has no internal state. What it renders is fully driven by its input props. Rendering the same pure component twice with the same props should result in the same UI. There's no hidden state inside the component that would cause the UI to differ between the two renders.

*This has a similar simplifying effect as using pure functions does: We can figure out what a component does by looking at what it receives as inputs and what it renders. There's nothing else we need to know about the component. We can also test it really easily - almost as easily as we were able to test our pure application logic.*

*If components can't have state, where will the state be? In an immutable data structure inside a Redux store! We've already seen how that works. The big idea is to separate the state from the user interface code. The React components are just a stateless projection of the state at a given point in time.*
