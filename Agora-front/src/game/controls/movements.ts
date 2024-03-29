import Boundary from '../classes/Boundary'
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

export const handlePlayerMovement = (
  player: Sprite,
  direction: Direction,
  positionChange: Position,
  boundaries: Boundary[],
  movables: (Sprite | Boundary)[],
) => {
  player.moving = true
  player.image = player.playerSprites[direction]
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
    movable.position.x += positionChange.x
    movable.position.y += positionChange.y
  })
}
