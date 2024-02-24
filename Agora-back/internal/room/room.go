package room

import (
	"log"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/gorilla/websocket"
)

const LOBBY_ID = "lobby"

type BroadcastMessage struct {
    Message     []byte
    ExcludedPlayer *player.Player
}

type Room struct {
	Id         string
	players    map[*player.Player]bool
	broadcast  chan BroadcastMessage
	register   chan *player.Player
	unregister chan *player.Player
}

func NewRoom(id string) *Room {
    return &Room{
		Id:         id,
        players:    make(map[*player.Player]bool),
        broadcast:  make(chan BroadcastMessage),
        register:   make(chan *player.Player),
        unregister: make(chan *player.Player),
    }
}

func (r *Room) Run() {
	for {
		select {
		case player := <-r.register:
			r.players[player] = true
		case player := <-r.unregister:
			delete(r.players, player)
		case message := <-r.broadcast:
			for player := range r.players {
				if player != message.ExcludedPlayer {
                    player.Lock()
                    err := player.Connection.WriteMessage(websocket.TextMessage, message.Message)
                    player.Unlock()
                    if err != nil {
                        log.Printf("Error broadcasting to player: %v", err)
                    }
                }
			}
		}
	}
}  

func (r *Room) Subscribe(p *player.Player) {
	r.register <- p
	log.Printf("Player %s subscribed to room %s", p.Connection.RemoteAddr(), r.Id)
}

func (r *Room) Unsubscribe(p *player.Player) {
	r.unregister <- p
	log.Printf("Player %s unsubscribed from room %s", p.Connection.RemoteAddr(), r.Id)
}

func (r *Room) Broadcast(message []byte, excludedPlayer *player.Player) {
	r.broadcast <- BroadcastMessage{Message: message, ExcludedPlayer: excludedPlayer}
}