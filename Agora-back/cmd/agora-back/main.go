package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type WebsocketClient struct {
	websocket   *websocket.Conn
	sync.Mutex
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        http.Error(w, "Could not open websocket connection", http.StatusInternalServerError)
        return
    }
    defer ws.Close()

    for {
        _, msg, err := ws.ReadMessage()
        if err != nil {
            log.Println(err)
            break
        }
        log.Printf("Received: %s", msg)
        err = ws.WriteMessage(websocket.TextMessage, msg)
        if err != nil {
            log.Println(err)
            break
        }
    }
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/ws", HandleWebSocket)

    server := &http.Server{
        Addr:    ":8080",
        Handler: mux,
    }

    go func() {
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    log.Println("Server started")

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt)
    <-quit
    log.Println("Server shutting down")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := server.Shutdown(ctx); err != nil {
        log.Fatal(err)
    }

    log.Println("Server gracefully stopped")
}