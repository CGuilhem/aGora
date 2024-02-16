export type Position = {
  x: number
  y: number
}

export type Frames = {
  max: number
  value: number
  elapsed: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type AnimationImages = {
  moving: HTMLImageElement
  idle: HTMLImageElement
}

export type PlayerSprites = {
  [key in Direction]: AnimationImages
}
