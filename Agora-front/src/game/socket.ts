export const SOCKET_TYPES = {
  HAS_MOVED: 'playerHasMoved',
  //   JOIN_GAME: 'JOIN_GAME',
  //   GAME_STATE: 'GAME_STATE',
  //   GAME_OVER: 'GAME_OVER',
  //   RESET_GAME: 'RESET_GAME',
  //   LEAVE_GAME: 'LEAVE_GAME',
  //   ERROR: 'ERROR',
}

export const socket = new WebSocket('ws://localhost:8080/ws')

socket.onmessage = function (event) {
  const message = JSON.parse(event.data)
  console.log(message)
}
