package websocket

import (
	"encoding/json"
	"os"

	"github.com/NathanFirmo/scrapping-platform/worker/internal/runner"
	"github.com/gorilla/websocket"
	log "github.com/inconshreveable/log15"
	"github.com/joho/godotenv"
)

type WorkerConfig struct {
	Cron    string `json:"cron"`
	Keyword string `json:"keyword"`
}

func Connect(r *runner.Runner) {
	var err error
	err = godotenv.Load()

	conn, _, err := websocket.DefaultDialer.Dial(os.Getenv("WS_URI"), nil)
	if err != nil {
		log.Error("Error connecting to WebSocket:", err)
	}
	defer conn.Close()

	go func() {
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Error("Disconnected from WebSocket server")
				panic(err)
			}

			var config WorkerConfig

			err = json.Unmarshal(message, &config)

			r.UpdateKeyword(config.Keyword)
			r.UpdateCron(config.Cron)
		}
	}()

	message := []byte("{ \"event\": \"worker-status-change\", \"data\": \"ONLINE\" }")
	err = conn.WriteMessage(websocket.TextMessage, message)
	if err != nil {
		log.Error("Error sending message:", err)
	}

	select {}
}
