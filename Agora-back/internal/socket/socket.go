package socket

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/CGuilhem/Agora/Agora-back/internal/room"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request, lobby *room.Room) {

	wsConnection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, "Could not open websocket connection", http.StatusInternalServerError)
		return
	}
	defer wsConnection.Close()

	player := player.NewPlayer(wsConnection, lobby.Id)
	log.Printf("New WebSocket connection: %s", wsConnection.RemoteAddr())
	lobby.Subscribe(player)
	defer lobby.Unsubscribe(player)

	BroadcastNewPlayer(player, lobby)

	for {
		_, msg, err := player.Connection.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}
		log.Printf("Received: %s", msg)

		var message Message
		err = json.Unmarshal(msg, &message)
		if err != nil {
			log.Println(err)
			break
		}

		if strings.Contains(message.Type, "playerMovement") {
			switch message.Type {
			case PLAYER_MOVEMENT_UP:
				player.MoveUp()
				BroadcastNewPosition(player, "up", lobby)

			case PLAYER_MOVEMENT_DOWN:
				player.MoveDown()
				BroadcastNewPosition(player, "down", lobby)

			case PLAYER_MOVEMENT_LEFT:
				player.MoveLeft()
				BroadcastNewPosition(player, "left", lobby)

			case PLAYER_MOVEMENT_RIGHT:
				player.MoveRight()
				BroadcastNewPosition(player, "right", lobby)
			}
		}
	}
}
