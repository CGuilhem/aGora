import { IMAGE_SCALING_FACTOR } from '../parameters'
import { Position } from '../types'

class Boundary {
  position: Position
  static width: number = 48 * IMAGE_SCALING_FACTOR
  static height: number = 48 * IMAGE_SCALING_FACTOR

  constructor({ position }: { position: Position }) {
    this.position = position
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = 'rgba(0, 0, 0, 0.0)'
    c.fillRect(
      this.position.x,
      this.position.y,
      Boundary.width,
      Boundary.height,
    )
  }
}

export default Boundary
