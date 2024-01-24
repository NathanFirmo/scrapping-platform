import { Logger } from "@nestjs/common"

export class WorkerStatus {
  static _instance: WorkerStatus
  private key: 'OFFLINE' | 'ONLINE' = 'OFFLINE'

  static getInstance(): WorkerStatus {
    if (this._instance) {
      return this._instance
    }

    this._instance = new WorkerStatus()

    return this._instance
  }

  update(key: 'OFFLINE' | 'ONLINE') {
    Logger.log(key, 'WorkerStatus')
    this.key = key
  }

  current() {
    return this.key
  }
}
