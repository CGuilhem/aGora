import { images } from './assetUtils/loading'
import { Player } from './classes/Player'
import { initiatePlayerIdle } from './controls/movements'
import { IMAGE_SCALING_FACTOR } from './parameters'
import { Position } from './types'

export const SOCKET_TYPES = {
  PLAYER_JOINED: 'playerJoined',
  PLAYER_HAS_MOVED: 'playerHasMoved',
  //   GAME_STATE: 'GAME_STATE',
  //   GAME_OVER: 'GAME_OVER',
  //   RESET_GAME: 'RESET_GAME',
  //   LEAVE_GAME: 'LEAVE_GAME',
  //   ERROR: 'ERROR',
}

export const socket = new WebSocket('ws://localhost:8080/ws')

const playersDataFromServer: Array<{ [key: string]: Position }> = []

const playersOnLine: Player[] = []

export const getPlayersOnLine = (): Player[] => {
  return playersOnLine
}

const updatePlayersOnLine = () => {
  return playersDataFromServer.map(() => {
    playersOnLine.push(
      new Player({
        image: images?.playerLeftImage || new Image(),
        position: {
          x: 700,
          y: 1008 / 2 - 96 / 2,
        },
        scaling: IMAGE_SCALING_FACTOR,
        frames: { max: 6, value: 0, elapsed: 0 },
        moving: false,
        playerSprites: {
          Up: {
            moving: images?.playerUpImage || new Image(),
            idle: images?.playerIdleUpImage || new Image(),
          },
          Down: {
            moving: images?.playerDownImage || new Image(),
            idle: images?.playerIdleDownImage || new Image(),
          },
          Left: {
            moving: images?.playerLeftImage || new Image(),
            idle: images?.playerIdleLeftImage || new Image(),
          },
          Right: {
            moving: images?.playerRightImage || new Image(),
            idle: images?.playerIdleRightImage || new Image(),
          },
        },
      }),
    )
  })
}

socket.onmessage = function (event) {
  const message = JSON.parse(event.data)
  console.log(message)
  if (message.type === SOCKET_TYPES.PLAYER_JOINED) {
    console.log('Player joined')
    playersDataFromServer.push({ [message.data.id]: message.data.position })
    updatePlayersOnLine()
    playersOnLine.forEach((player) => {
      // Maybe refacto to move that function into the class Player
      initiatePlayerIdle(player, 'Left')
    })
    console.log(playersOnLine)
  }
}
