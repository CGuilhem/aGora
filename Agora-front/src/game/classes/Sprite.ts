import { Frames, PlayerSprites, Position } from '../types'

export class Sprite {
  image: HTMLImageElement
  scaling: number
  position: Position
  width: number
  height: number
  frames: Frames
  moving: boolean
  playerSprites: PlayerSprites

  constructor({
    image,
    scaling,
    position,
    frames = { max: 1, value: 0, elapsed: 0 },
    moving = false,
    playerSprites,
  }: {
    image: HTMLImageElement
    scaling: number
    position: Position
    frames?: Frames
    moving?: boolean
    playerSprites?: PlayerSprites
  }) {
    this.image = image
    this.scaling = scaling
    this.position = position
    this.width = (image.width * scaling) / frames.max
    this.height = image.height * scaling
    this.frames = frames
    this.moving = moving
    this.playerSprites = playerSprites as PlayerSprites
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

    if (!this.moving) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % 20 === 0) {
      if (this.frames.value < this.frames.max - 1) this.frames.value++
      else this.frames.value = 0
    }
  }
}
