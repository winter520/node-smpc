function personBroadcast (socket, type, req) {
  socket.emit(type, req)
}

module.exports = personBroadcast