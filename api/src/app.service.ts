import { WorkerStatus } from '../lib/core/workerStatus'
import { MongooseConnection, ScrappingElementSchema } from '../lib/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  async getScrappingData() {
    const MigrationToken = MongooseConnection.getIstance().connection.model(
      'websites',
      ScrappingElementSchema,
      'websites',
    )

    const models = await MigrationToken.find()

    return models.map((model) => model.toJSON())
  }

  getStatus() {
    return {
      status: WorkerStatus.getInstance().current(),
    }
  }
}
