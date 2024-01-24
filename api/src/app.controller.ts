import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/scrapping-data')
  async getHello() {
    return this.appService.getScrappingData()
  }

  @Get('/status')
  getStatus() {
    return this.appService.getStatus()
  }
}
