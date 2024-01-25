FROM golang:1.21.6 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build ./cmd/scrapper/main.go

FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/main /main

ENTRYPOINT ["/main"]
