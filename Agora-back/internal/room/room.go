package room

import (
	"log"

	"github.com/CGuilhem/Agora/Agora-back/internal/client"
	"github.com/gorilla/websocket"
)

type Room struct {
	id         string
	clients    map[*client.Client]bool
	broadcast  chan []byte
	register   chan *client.Client
	unregister chan *client.Client
}

func NewRoom(id string) *Room {
    return &Room{
		id:         id,
        clients:    make(map[*client.Client]bool),
        broadcast:  make(chan []byte),
        register:   make(chan *client.Client),
        unregister: make(chan *client.Client),
    }
}

func (r *Room) Run() {
	for {
		select {
		case client := <-r.register:
			r.clients[client] = true
		case client := <-r.unregister:
			delete(r.clients, client)
		case message := <-r.broadcast:
			for client := range r.clients {
				client.Lock()
				client.Connection.WriteMessage(websocket.TextMessage, message)
				client.Unlock()
			}
		}
	}
}

func (r *Room) Subscribe(c *client.Client) {
	r.register <- c
	log.Printf("Client %s subscribed to room %s", c.Connection.RemoteAddr(), r.id)
}

func (r *Room) Unsubscribe(c *client.Client) {
	r.unregister <- c
	log.Printf("Client %s unsubscribed from room %s", c.Connection.RemoteAddr(), r.id)
}

func (r *Room) Broadcast(msg []byte) {
	r.broadcast <- msg
}