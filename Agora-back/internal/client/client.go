package client

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Connection *websocket.Conn
	sync.Mutex
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		Connection: conn,
	}
}