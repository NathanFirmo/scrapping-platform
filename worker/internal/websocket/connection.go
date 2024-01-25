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

var srvlog = log.New("service", "websocket-connection")

func Connect(r *runner.Runner) {
  if _, err := os.Stat(".env"); err == nil {
		godotenv.Load()
	}

	wsUrl := os.Getenv("WS_URI")

	conn, _, err := websocket.DefaultDialer.Dial(wsUrl, nil)
	if err != nil {
		srvlog.Error("Error connecting to WebSocket:", err, "WS_URI", wsUrl, nil)
    panic(err)
	}

	go func() {
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				srvlog.Error("Disconnected from WebSocket server", nil)
				panic(err)
			}

			var config WorkerConfig

			err = json.Unmarshal(message, &config)

			if err != nil {
				srvlog.Error("Unable to marhall %v", err, nil)
				return
			}

			if config.Keyword != r.Keyword {
				r.UpdateKeyword(config.Keyword)
			}

			if config.Cron != r.CronExpression {
				r.UpdateCron(config.Cron)
			}

		}
	}()

	message := []byte("{ \"event\": \"worker-status-change\", \"data\": \"ONLINE\" }")
	err = conn.WriteMessage(websocket.TextMessage, message)
	if err != nil {
		log.Error("Error sending message:", err)
    panic(err)
	}
	srvlog.Info("Successfully connected to WebSocket!", wsUrl)
}
