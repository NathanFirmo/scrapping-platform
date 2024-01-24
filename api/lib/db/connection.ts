import * as mongoose from 'mongoose'
import { environment } from '../../lib/core'
import { Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

export class MongooseConnection {
  private static instance: MongooseConnection

  uri = environment.mongoUrl

  connection = mongoose.createConnection(environment.mongoUrl, {
    authSource: 'admin',
    user: environment.mongoUser,
    pass: environment.mongoPassword,
    dbName: 'scrapping-platform',
  })

  static getIstance() {
    if (!this.instance) {
      this.instance = new MongooseConnection()
    }
    mongoose.set('strictQuery', true)
    return this.instance
  }

  static async connect() {
    await MongooseConnection.getIstance().connection.asPromise()

    const logger = new Logger('MongooseConnection')
    logger.log('Connected')
  }
}
