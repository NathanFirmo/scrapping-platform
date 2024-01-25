# Scrapping platform

## Arquitetura

![Modelagem BrandMonitor excalidraw](https://github.com/NathanFirmo/scrapping-platform/assets/79997705/521c67d7-df35-4b39-b2fe-d688fd8a5050)

## Rodando localmente

~~~shell
git clone https://github.com/NathanFirmo/scrapping-platform.git

cd scrapping-platform

docker compose up --build
~~~

### Serviços

#### Frontend

Acesse http://127.0.0.1:3000 em seu navegador.

#### Backend NestJS

Portas expostas:

- HTTP: 3001
- WebSocket: 8080

## Dependências

- Go: 1.21.6
- Node: 18.17.0
