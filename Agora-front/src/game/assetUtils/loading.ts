import playerDown from '../../assets/characters/Player_Down_48x48_05.png'
import playerLeft from '../../assets/characters/Player_Left_48x48_05.png'
import playerRight from '../../assets/characters/Player_Right_48x48_05.png'
import playerUp from '../../assets/characters/Player_Up_48x48_05.png'
import lobby from '../../assets/maps/Lobby_1392x1008.png'
import lobbyForeground from '../../assets/maps/Lobby_Foreground_1392x1008.png'

const imageSources = {
  lobbyImage: lobby,
  lobbyForegroundImage: lobbyForeground,
  playerDownImage: playerDown,
  playerUpImage: playerUp,
  playerLeftImage: playerLeft,
  playerRightImage: playerRight,
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export const loadImages = async () => {
  try {
    const loadedImages = await Promise.all(
      Object.entries(imageSources).map(([, src]) => loadImage(src)),
    )

    // Create an object where the keys are the image names and the values are the loaded images
    const images = Object.fromEntries(
      Object.keys(imageSources).map((key, i) => [key, loadedImages[i]]),
    )

    return images
  } catch (error) {
    console.error('Error loading images:', error)
  }
}
