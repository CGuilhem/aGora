package room

import (
	"log"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/gorilla/websocket"
)

type Room struct {
	id         string
	players    map[*player.Player]bool
	broadcast  chan []byte
	register   chan *player.Player
	unregister chan *player.Player
}

func NewRoom(id string) *Room {
    return &Room{
		id:         id,
        players:    make(map[*player.Player]bool),
        broadcast:  make(chan []byte),
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
				player.Lock()
				player.Connection.WriteMessage(websocket.TextMessage, message)
				player.Unlock()
			}
		}
	}
}

func (r *Room) Subscribe(p *player.Player) {
	r.register <- p
	log.Printf("Player %s subscribed to room %s", p.Connection.RemoteAddr(), r.id)
}

func (r *Room) Unsubscribe(p *player.Player) {
	r.unregister <- p
	log.Printf("Player %s unsubscribed from room %s", p.Connection.RemoteAddr(), r.id)
}

func (r *Room) Broadcast(msg []byte) {
	r.broadcast <- msg
}