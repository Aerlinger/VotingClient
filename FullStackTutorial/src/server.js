import Server from 'socket.io';

export default function startServer() {
  const io = new Server().attach(8090);

  // 5. `subscribe` callback function is executed, with updated state as its argument
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  )

  io.on('connection', (socket) => {
    // 6. Server emits a 'state' event
    // 7. All connected clients receive the new state
    socket.emit('state', store.getState().toJS());

    // 1. Client sends action to server
    // 2. Server hands action to redux store
    // 3. The store calls the reducer,
    // 4. State gets updated
    socket.on('action', store.dispatch.bind(store))

  })
}
