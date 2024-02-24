package socket

import (
	"encoding/json"
	"log"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/CGuilhem/Agora/Agora-back/internal/room"
)

type DataMovement struct {
	Position struct {
		X int `json:"x"`
		Y int `json:"y"`
	} `json:"position"`
	Direction string `json:"direction"`
}

func BroadcastNewPosition(player *player.Player, direction string, lobby *room.Room) {

	message := Message{
		Type: PLAYER_HAS_MOVED,
		Data: DataMovement{
			Position: player.Position,
			Direction: direction,
		},
	}

	bytes, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	lobby.Broadcast(bytes, player)
}