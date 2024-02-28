import Boundary from '../classes/Boundary'
import { Player } from '../classes/Player'
import { Sprite } from '../classes/Sprite'
import { checkRectangularCollision } from '../collisions/collisions'
import { Direction, Position } from '../types'

export const lastKey = {
  value: '',
}

export const KEYS = {
  z: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const initiatePlayerMovement = (player: Player, direction: Direction) => {
  player.moving = true
  player.image = player.playerSprites[direction]['moving']
}

export const initiatePlayerIdle = (player: Player, direction: Direction) => {
  player.moving = false
  player.image = player.playerSprites[direction]['idle']
}

export const handlePlayerMovement = (
  player: Player,
  direction: Direction,
  positionChange: Position,
  boundaries: Boundary[],
  movables: (Sprite | Boundary | Player)[],
  socket: WebSocket,
) => {
  initiatePlayerMovement(player, direction)

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
      boundary &&
      checkRectangularCollision({
        a: player,
        b: {
          ...boundary,
          position: {
            x: boundary.position.x + positionChange.x,
            y: boundary.position.y + positionChange.y,
          },
          draw: () => {
            throw new Error('Function not implemented.')
          },
        },
      })
    ) {
      return // Do not move
    }
  }

  movables.forEach((movable) => {
    if (movable instanceof Player) {
      // Don't have the explanation yet
      movable.position.x += positionChange.x / 2
      movable.position.y += positionChange.y / 2
    } else {
      movable.position.x += positionChange.x
      movable.position.y += positionChange.y
    }
  })

  socket.send(
    JSON.stringify({
      type: 'playerMovement' + direction,
    }),
  )
}
