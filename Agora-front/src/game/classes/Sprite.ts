import { Position } from '../types'

export class Sprite {
  image: HTMLImageElement
  scaling: number
  position: Position
  width: number
  height: number

  constructor({
    image,
    scaling,
    position,
  }: {
    image: HTMLImageElement
    scaling: number
    position: Position
  }) {
    this.image = image
    this.scaling = scaling
    this.position = position
    this.width = image.width * scaling
    this.height = image.height * scaling
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      0, // Source crop x
      0, // Source crop y
      this.image.width, // Source width
      this.image.height, // Source height
      this.position.x,
      this.position.y,
      this.width, // Destination width
      this.height, // Destination height
    )
  }
}
