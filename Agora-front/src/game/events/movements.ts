import { KEYS, lastKey } from '../controls/movements'

export const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'z':
    case 'Z':
      KEYS.z.pressed = true
      lastKey.value = 'z'
      break
    case 's':
    case 'S':
      KEYS.s.pressed = true
      lastKey.value = 's'
      break
    case 'q':
    case 'Q':
      KEYS.q.pressed = true
      lastKey.value = 'q'
      break
    case 'd':
    case 'D':
      KEYS.d.pressed = true
      lastKey.value = 'd'
      break
    default:
      break
  }
}

export const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'z':
    case 'Z':
      KEYS.z.pressed = false
      break
    case 's':
    case 'S':
      KEYS.s.pressed = false
      break
    case 'q':
    case 'Q':
      KEYS.q.pressed = false
      break
    case 'd':
    case 'D':
      KEYS.d.pressed = false
      break
    default:
      break
  }
}
