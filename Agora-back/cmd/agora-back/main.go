package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/CGuilhem/Agora/Agora-back/internal/player"
	"github.com/CGuilhem/Agora/Agora-back/internal/room"
	"github.com/gorilla/websocket"
)


type Message struct {
    Type string `json:"type"`
    Data struct {
        Position struct {
            X int `json:"x"`
            Y int `json:"y"`
        } `json:"position"`
    } `json:"data"`
}

var lobby = room.NewRoom("lobby")

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

    player := player.NewPlayer(ws)
    log.Printf("New WebSocket connection: %s", ws.RemoteAddr())
    lobby.Subscribe(player)
    defer lobby.Unsubscribe(player)    
    

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

        var message Message
        err = json.Unmarshal(msg, &message)
        if err != nil {
            log.Println(err)
            break
        }

        if message.Type == "playerMovement" {
            log.Printf("Player moved to position: %v", message.Data.Position)

            // Calculate new position...
            newPosition := message.Data.Position
            newPosition.X += 1  // Example: increment X by 1
            newPosition.Y += 1  // Example: increment Y by 1

            newMessage := Message{
                Type: "playerMovement",
                Data: struct {
                    Position struct {
                        X int `json:"x"`
                        Y int `json:"y"`
                    } `json:"position"`
                }{
                    Position: newPosition,
                },
            }

            newMsg, err := json.Marshal(newMessage)
            if err != nil {
                log.Println(err)
                break
            }

            err = ws.WriteMessage(websocket.TextMessage, newMsg)
            if err != nil {
                log.Println(err)
                break
            }
        }
    }
}

func main() {
    go lobby.Run()

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