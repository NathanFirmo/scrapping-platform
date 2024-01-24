import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { environment } from '../lib/core'
import { MongooseConnection } from '../lib/db'
environment.check()
;(async () => {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(environment.port)

  const logger = new Logger('NestApplication')

  logger.log(`HTTP Server running on http://127.0.0.1:${environment.port}`)
  logger.log(`WebSocket Server running on ws://127.0.0.1:8080`)
  await MongooseConnection.connect()
})()
