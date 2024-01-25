FROM node:18-alpine as builder

WORKDIR /app

COPY . .

ENV NEXT_PUBLIC_API_URL="http://api:3001" \
    NEXT_PUBLIC_WEBSOCKET_URL="ws://api:8080" 

RUN npm ci && npm run build

# FROM node:18-alpine as final

# COPY --from=builder /app/.next /app/.next
# COPY --from=builder /app/node_modules /app/node_modules

# WORKDIR /app

# EXPOSE 8080 3001

# CMD ["npm", "start"]
