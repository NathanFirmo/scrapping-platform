import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/scrapping-data')
  async getScrappingData() {
    return this.appService.getScrappingData()
  }

  @Get('/runs')
  async getRuns() {
    return this.appService.getRuns()
  }

  @Get('/config')
  async getConf() {
    return this.appService.getConfig()
  }

  @Get('/status')
  getStatus() {
    return this.appService.getStatus()
  }
}
