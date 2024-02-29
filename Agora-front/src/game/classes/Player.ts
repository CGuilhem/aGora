import { PLAYER_MOVING_FRAMES, PLAYER_IDLE_FRAMES } from '../parameters'
import { Direction, Frames, PlayerSprites, Position } from '../types'
import { Sprite } from './Sprite'

export class Player extends Sprite {
  frames: Frames
  moving: boolean
  playerSprites: PlayerSprites

  constructor({
    image,
    scaling,
    position,
    frames,
    moving,
    playerSprites,
  }: {
    image: HTMLImageElement
    scaling: number
    position: Position
    frames: Frames
    moving: boolean
    playerSprites: PlayerSprites
  }) {
    super({ image, scaling, position })
    this.frames = frames
    this.width = (image.width * scaling) / frames.max
    this.moving = moving
    this.playerSprites = playerSprites as PlayerSprites
  }

  initiatePlayerMovementAnimation = (direction: Direction) => {
    this.moving = true
    this.image = this.playerSprites[direction]['moving']
  }

  initiatePlayerIdleAnimation = (direction: Direction) => {
    this.moving = false
    this.image = this.playerSprites[direction]['idle']
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      (this.frames.value * this.width) / this.scaling, // Source crop x
      0, // Source crop y
      this.image.width / this.frames.max, // Source width
      this.image.height, // Source height
      this.position.x,
      this.position.y,
      this.width, // Destination width
      this.height, // Destination height
    )

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    const frameRate = this.moving ? PLAYER_MOVING_FRAMES : PLAYER_IDLE_FRAMES

    // Movement or Idle animation speed
    if (this.frames.elapsed % frameRate === 0) {
      this.frames.value =
        this.frames.value < this.frames.max - 1 ? this.frames.value + 1 : 0
    }
  }
}
