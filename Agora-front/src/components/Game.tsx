import { useEffect, useRef } from 'react'
import { loadImages } from '../game/assetUtils/loading'
import { Sprite } from '../game/classes/Sprite'
import { createBoundaries } from '../game/collisions/collisions'
import {
  KEYS,
  handlePlayerMovement,
  initiatePlayerIdle,
  lastKey,
} from '../game/controls/movements'
import { handleKeyDown, handleKeyUp } from '../game/events/movements'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  IMAGE_SCALING_FACTOR,
  OFFSET,
} from '../game/parameters'
import { socket } from '../game/socket'
import { Player } from '../game/classes/Player'

const Game = () => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    if (canvas !== null) {
      canvas.width = CANVAS_WIDTH
      canvas.height = CANVAS_HEIGHT
      const c = canvas.getContext('2d')

      if (c !== null) {
        c.imageSmoothingEnabled = false

        socket.onopen = () => {
          console.log('Connected to the server')
        }

        loadImages().then((images) => {
          const background = new Sprite({
            image: images?.lobbyImage || new Image(),
            position: { x: OFFSET.X, y: OFFSET.Y },
            scaling: IMAGE_SCALING_FACTOR,
          })

          const player = new Player({
            image: images?.playerLeftImage || new Image(),
            position: {
              x: canvas?.width / 2 - 288 / 12,
              y: canvas.height / 2 - 96 / 2,
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
          })

          const foreground = new Sprite({
            image: images?.lobbyForegroundImage || new Image(),
            position: { x: OFFSET.X, y: OFFSET.Y },
            scaling: IMAGE_SCALING_FACTOR,
          })

          const boundaries = createBoundaries()

          const movables = [background, foreground, ...boundaries]

          const animate = () => {
            window.requestAnimationFrame(animate)

            c.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
            background.draw(c)
            boundaries.forEach((boundary) => {
              boundary.draw(c)
            })
            player.draw(c)
            foreground.draw(c)

            switch (lastKey.value) {
              case 'z':
                initiatePlayerIdle(player, 'Up')
                break
              case 's':
                initiatePlayerIdle(player, 'Down')
                break
              case 'q':
                initiatePlayerIdle(player, 'Left')
                break
              case 'd':
                initiatePlayerIdle(player, 'Right')
                break
              default:
                initiatePlayerIdle(player, 'Left')
            }

            if (KEYS.z.pressed && lastKey.value === 'z') {
              handlePlayerMovement(
                player,
                'Up',
                { x: 0, y: 3 },
                boundaries,
                movables,
                socket,
              )
            } else if (KEYS.s.pressed && lastKey.value === 's') {
              handlePlayerMovement(
                player,
                'Down',
                { x: 0, y: -3 },
                boundaries,
                movables,
                socket,
              )
            } else if (KEYS.q.pressed && lastKey.value === 'q') {
              handlePlayerMovement(
                player,
                'Left',
                { x: 3, y: 0 },
                boundaries,
                movables,
                socket,
              )
            } else if (KEYS.d.pressed && lastKey.value === 'd') {
              handlePlayerMovement(
                player,
                'Right',
                { x: -3, y: 0 },
                boundaries,
                movables,
                socket,
              )
            }
          }

          window.addEventListener('keydown', handleKeyDown)
          window.addEventListener('keyup', handleKeyUp)
          animate()
        })
      }
    }

    // Cleanup function in order to remove the event listener when the component unmounts
    return () => {
      // socket.off('connect')
      // socket.off('disconnect')
      // socket.off('connect_error')
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return <canvas ref={ref} />
}

export default Game
