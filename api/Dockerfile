FROM node:18-alpine as deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

FROM node:18-alpine as builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules /app/node_modules

RUN npm run build

FROM node:18-alpine as final

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/

WORKDIR /app

EXPOSE 8080 3001

CMD ["npm", "run", "start:prod"]
