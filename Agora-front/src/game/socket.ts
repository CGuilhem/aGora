export const SOCKET_TYPES = {
  //   JOIN_GAME: 'JOIN_GAME',
  //   GAME_STATE: 'GAME_STATE',
  //   MOVE: 'MOVE',
  //   GAME_OVER: 'GAME_OVER',
  //   RESET_GAME: 'RESET_GAME',
  //   LEAVE_GAME: 'LEAVE_GAME',
  //   ERROR: 'ERROR',
}

export const socket = new WebSocket('ws://localhost:8080/ws')
