package player

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Player struct {
	Connection *websocket.Conn
	sync.Mutex
}

func NewPlayer(conn *websocket.Conn) *Player {
	return &Player{
		Connection: conn,
	}
}