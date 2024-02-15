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

export type PlayerSprites = {
  [key in Direction]: HTMLImageElement
}
