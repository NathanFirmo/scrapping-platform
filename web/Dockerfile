FROM node:18-alpine as deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm i

FROM node:18-alpine as builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules /app/node_modules

ENV VITE_API_URL="http://127.0.0.1:3001" \
    VITE_WEBSOCKET_URL="ws://127.0.0.1:8080"

RUN npm run build

FROM nginx:alpine as final

COPY --from=builder /app/dist /app/static

WORKDIR /app

COPY ./nginx.conf /etc/nginx/nginx.conf
