/* 2. The remote action middleware sends the action over the Socket.io connection. */
export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    socket.emit('action', action);
  }

  return next(action);
}
