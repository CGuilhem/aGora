package socket

import (
	"encoding/json"
	"log"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/CGuilhem/Agora/Agora-back/internal/room"
)

func BroadcastNewPlayer(player *player.Player, room *room.Room) {

	message := Message{
		Type: PLAYER_JOINED,
		Data: map[string]interface{}{
			"id": player.PlayerId,
			"position": player.Position,
		},
	}

	bytes, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	room.Broadcast(bytes, player)
}

func BroadcastPlayerLeft(player *player.Player, room *room.Room) {

	message := Message{
		Type: PLAYER_LEFT,
		Data: player.PlayerId,
	}

	bytes, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	room.Broadcast(bytes, player)
}
