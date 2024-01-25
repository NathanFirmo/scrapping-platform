import { WorkerStatus } from '../lib/core/workerStatus'
import {
  ConfigSchema,
  MongooseConnection,
  RunSchema,
  ScrappingElementSchema,
} from '../lib/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  async getScrappingData() {
    const ScrappingElement = MongooseConnection.getIstance().connection.model(
      'websites',
      ScrappingElementSchema,
      'websites',
    )

    const models = await ScrappingElement.find()

    return models.map((model) => model.toJSON())
  }

  async getConfig() {
    const Config = MongooseConnection.getIstance().connection.model(
      'config',
      ConfigSchema,
      'config',
    )

    const model = await Config.findOne()

    return model.toJSON()
  }

  async getRuns() {
    const Runs = MongooseConnection.getIstance().connection.model(
      'runs',
      RunSchema,
      'runs',
    )

    const models = await Runs.find()

    return models.map((model) => model.toJSON())
  }

  getStatus() {
    return {
      status: WorkerStatus.getInstance().current(),
    }
  }
}
