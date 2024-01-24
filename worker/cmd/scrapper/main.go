package main

import (
	"github.com/NathanFirmo/scrapping-platform/worker/internal/db"
	"github.com/NathanFirmo/scrapping-platform/worker/internal/runner"
	"github.com/NathanFirmo/scrapping-platform/worker/internal/websocket"
)

func main() {
	db.Connect()
  c := runner.Create()
	websocket.Connect(c)
}
