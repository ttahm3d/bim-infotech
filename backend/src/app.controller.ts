import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    try {
      return this.appService.getAllEmployees();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch employees');
    }
  }
}
