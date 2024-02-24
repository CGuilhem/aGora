package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/CGuilhem/Agora/Agora-back/internal/room"
	"github.com/CGuilhem/Agora/Agora-back/internal/socket"
)


func main() {
    lobby := room.NewRoom("lobby")
    go lobby.Run()

    mux := http.NewServeMux()
    mux.HandleFunc("/ws", func (w http.ResponseWriter, r *http.Request) {
        socket.HandleWebSocket(w, r, lobby)
    })

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