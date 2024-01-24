import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { WorkerStatus } from 'lib/core/workerStatus'
import { Server, WebSocket } from 'ws'

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('worker-config-change')
  onConfigChange(client: any, data: any) {
    this.server.clients.forEach((c) => {
      if (c !== client) {
        c.send(JSON.stringify(data))
      }
    })
  }

  @SubscribeMessage('worker-status-change')
  onStatusChange(client: WebSocket, data: any) {
    if (data === 'ONLINE') {
      WorkerStatus.getInstance().update('ONLINE')
    }

    client.onclose = () => {
      WorkerStatus.getInstance().update('OFFLINE')

      this.server.clients.forEach((c) => {
        if (c !== client) {
          c.send(
            JSON.stringify({ event: 'worker-status-change', data: 'OFFLINE' }),
          )
        }
      })
    }
  }
}
